(() => {
  const SUPABASE_URL = 'https://pjeeconeytobwztumkan.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Kf40xX-uo_dP4PSp9W8lMA_8jBgtL3o';
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  let activeUserId = null;
  let channel = null;
  let roomShelvesAvailable = false;
  let pushRunning = false;
  let pushPending = false;
  let locationsPushRunning = false;
  let locationsPushPending = false;

  const status = (message, error = false) => {
    const el = document.getElementById('syncStatus');
    if (el) {
      el.textContent = message;
      el.style.color = error ? '#a33' : '';
    }
  };

  const toRow = book => ({
    book_id: String(book.id).trim(),
    title: book.title,
    author: book.author || '',
    isbn: book.isbn || '',
    room: book.room || '',
    shelf: book.shelf || '',
    member: book.member || '',
    destination: book.destination || '',
    details: book.details || ''
  });

  const fromRow = row => ({
    id: row.book_id,
    title: row.title,
    author: row.author || '',
    isbn: row.isbn || '',
    room: row.room || '',
    shelf: row.shelf || '',
    member: row.member || '',
    destination: row.destination || '',
    details: row.details || ''
  });

  async function loadSharedBooks() {
    status('Loading your shared collection…');
    const { data, error } = await client.from('books').select('*').order('book_id');
    if (error) throw error;

    const remoteBooks = (data || []).map(fromRow);
    const remoteIds = new Set(remoteBooks.map(book => book.id.toLowerCase()));
    const localOnly = window.BookTrack.getBooks().filter(book =>
      !remoteIds.has(String(book.id).toLowerCase())
    );

    if (localOnly.length) {
      const { error: uploadError } = await client
        .from('books')
        .upsert(localOnly.map(toRow), { onConflict: 'book_id' });
      if (uploadError) throw uploadError;
    }

    // Existing local books are merged by ID; remote versions win if an ID exists in both.
    window.BookTrack.replaceBooks([...remoteBooks, ...localOnly]);
    const localLocations = window.BookTrack.getLocations();
    const { data: locationData, error: locationError } = await client
      .from('room_shelves')
      .select('locations')
      .eq('id', true)
      .maybeSingle();
    roomShelvesAvailable = !locationError;
    if (locationError) {
      status('Books connected, but shared rooms and shelves need database setup: ' + locationError.message, true);
    } else {
      const locationsChanged = window.BookTrack.replaceLocations(
        locationData ? locationData.locations : [],
        [...remoteBooks, ...localOnly],
        locationData ? [] : localLocations
      );
      if (!locationData || locationsChanged) {
        const { error: locationsError } = await client.from('room_shelves').upsert(
          { id: true, locations: window.BookTrack.getLocations() },
          { onConflict: 'id' }
        );
        if (locationsError) throw locationsError;
      }
    }

    if (roomShelvesAvailable) {
      status('Connected. ' + (remoteBooks.length + localOnly.length) +
        ' shared book' + (remoteBooks.length + localOnly.length === 1 ? '' : 's') + '.');
    }
  }

  async function refreshFromRealtime() {
    const { data, error } = await client.from('books').select('*').order('book_id');
    if (error) {
      status('Could not refresh shared books: ' + error.message, true);
      return;
    }
    if (window.BookTrack.replaceBooks((data || []).map(fromRow))) pushLocations();
  }

  async function refreshLocationsFromRealtime() {
    const { data, error } = await client
      .from('room_shelves')
      .select('locations')
      .eq('id', true)
      .maybeSingle();
    if (error) {
      status('Could not refresh shared rooms and shelves: ' + error.message, true);
      return;
    }
    if (data) window.BookTrack.replaceLocations(data.locations, window.BookTrack.getBooks());
  }

  async function handleSession(session) {
    const gate = document.getElementById('authGate');
    const app = document.querySelector('.app');

    if (!session) {
      activeUserId = null;
      if (channel) {
        await client.removeChannel(channel);
        channel = null;
      }
      gate.hidden = false;
      app.classList.remove('ready');
      return;
    }

    gate.hidden = true;
    app.classList.add('ready');
    if (activeUserId === session.user.id) return;
    activeUserId = session.user.id;

    try {
      await loadSharedBooks();
      if (channel) await client.removeChannel(channel);
      channel = client.channel('booktrack-shared-books')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'books'
        }, refreshFromRealtime);
      if (roomShelvesAvailable) {
        channel.on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'room_shelves'
        }, refreshLocationsFromRealtime);
      }
      channel.subscribe();
    } catch (error) {
      status('Database setup or access needs attention: ' + error.message, true);
    }
  }

  document.getElementById('signInForm').addEventListener('submit', async event => {
    event.preventDefault();
    const email = document.getElementById('signInEmail').value.trim();
    const button = document.getElementById('sendSignIn');
    const message = document.getElementById('authStatus');
    button.disabled = true;
    message.textContent = 'Sending sign-in link…';

    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: location.origin + location.pathname
      }
    });

    button.disabled = false;
    message.textContent = error
      ? 'Could not send link: ' + error.message
      : 'If this address has been invited, a one-time sign-in link has been sent. Check your inbox.';
  });

  document.getElementById('signOutButton').addEventListener('click', async () => {
    const { error } = await client.auth.signOut();
    if (error) status('Sign-out failed: ' + error.message, true);
  });

  async function pushChanges() {
    if (pushRunning) {
      pushPending = true;
      return;
    }
    pushRunning = true;
    do {
      pushPending = false;
      const books = window.BookTrack.getBooks();
      const { error } = await client.from('books').upsert(
        books.map(toRow),
        { onConflict: 'book_id' }
      );
      if (error) {
        status('Cloud save failed: ' + error.message, true);
        break;
      }
      status('All changes synchronized.');
    } while (pushPending);
    pushRunning = false;
  }

  async function pushLocations() {
    if (!activeUserId) return;
    if (locationsPushRunning) {
      locationsPushPending = true;
      return;
    }
    locationsPushRunning = true;
    do {
      locationsPushPending = false;
      const { error } = await client.from('room_shelves').upsert(
        { id: true, locations: window.BookTrack.getLocations() },
        { onConflict: 'id' }
      );
      if (error) {
        status('Room and shelf sync failed: ' + error.message, true);
        break;
      }
      status('Room and shelf list synchronized.');
    } while (locationsPushPending);
    locationsPushRunning = false;
  }

  window.addEventListener('booktrack-locations-save', pushLocations);

  window.addEventListener('booktrack-local-save', async event => {
    const deletedBookId = event.detail && event.detail.deletedBookId;
    if (deletedBookId && activeUserId) {
      const { error } = await client.from('books').delete().eq('book_id', deletedBookId);
      if (error) status('Cloud delete failed: ' + error.message, true);
      else status('Book deleted from the shared collection.');
      return;
    }
    pushPending = true;
    if (activeUserId) pushChanges();
  });

  client.auth.onAuthStateChange((_event, session) => {
    Promise.resolve().then(() => handleSession(session));
  });

  client.auth.getSession().then(({ data, error }) => {
    if (error) {
      document.getElementById('authStatus').textContent = error.message;
      return;
    }
    handleSession(data.session);
  });
})();
