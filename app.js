// ===== FIREBASE CONFIG: Replace with your project's config =====
const firebaseConfig = {
  apiKey: "REPLACE_APIKEY",
  authDomain: "REPLACE_PROJECT.firebaseapp.com",
  projectId: "REPLACE_PROJECT",
  storageBucket: "REPLACE_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
// =============================================================

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// UI elements
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const authMsg = document.getElementById('authMsg');
const welcome = document.getElementById('welcome');
const logoutBtn = document.getElementById('logoutBtn');
const adminLink = document.getElementById('adminLink');

const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const productGrid = document.getElementById('productGrid');
const productCount = document.getElementById('productCount');

const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const modalName = document.getElementById('modalName');
const modalCategory = document.getElementById('modalCategory');
const modalPrice = document.getElementById('modalPrice');
const modalGate = document.getElementById('modalGate');
const modalBrokerArea = document.getElementById('modalBrokerArea');

// Admin page elements (if present)
const prodName = document.getElementById('prodName');
const prodCategory = document.getElementById('prodCategory');
const prodPrice = document.getElementById('prodPrice');
const prodGate = document.getElementById('prodGate');
const prodBroker = document.getElementById('prodBroker');
const saveProdBtn = document.getElementById('saveProdBtn');
const adminProducts = document.getElementById('adminProducts');
const prodMsg = document.getElementById('prodMsg');

let currentUser = null;
let productsCache = [];

// Auth handlers
signupBtn?.addEventListener('click', async () => {
  authMsg.innerText = '';
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passwordInput.value;
  if (!name || !email || !pass) { authMsg.innerText = 'Sab fields bharein'; return; }
  try {
    const res = await auth.createUserWithEmailAndPassword(email, pass);
    await res.user.updateProfile({ displayName: name });
    // create users doc with isAdmin=false by default
    await db.collection('users').doc(res.user.uid).set({ name, isAdmin: false });
  } catch (e) { authMsg.innerText = e.message; }
});

loginBtn?.addEventListener('click', async () => {
  authMsg.innerText = '';
  const email = emailInput.value.trim();
  const pass = passwordInput.value;
  if (!email || !pass) { authMsg.innerText = 'Email aur password dalein'; return; }
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (e) { authMsg.innerText = e.message; }
});

logoutBtn?.addEventListener('click', () => auth.signOut());

// Auth state
auth.onAuthStateChanged(async user => {
  currentUser = user;
  if (user) {
    welcome.innerHTML = `Hello, <b>${user.displayName || user.email}</b>`;
    logoutBtn.classList.remove('hidden');
    // check isAdmin
    const doc = await db.collection('users').doc(user.uid).get();
    const isAdmin = doc.exists && doc.data().isAdmin === true;
    if (isAdmin) adminLink.classList.remove('hidden'); else adminLink.classList.add('hidden');
  } else {
    welcome.innerText = 'Please sign up / login';
    logoutBtn.classList.add('hidden');
    adminLink.classList.add('hidden');
  }
});

// Load categories dynamic
function addCategoryOption(cat) {
  if (![...categorySelect.options].some(o => o.value === cat)) {
    const opt = document.createElement('option'); opt.value = cat; opt.innerText = cat;
    categorySelect.appendChild(opt);
  }
}

// realtime listener for products
db.collection('products').orderBy('createdAt','desc').onSnapshot(snap => {
  productsCache = [];
  snap.forEach(doc => productsCache.push({ id: doc.id, ...doc.data() }));
  renderProducts(productsCache);
  // update categories
  const cats = Array.from(new Set(productsCache.map(p => p.category)));
  cats.forEach(addCategoryOption);
});

// render
function renderProducts(list) {
  const q = (searchInput.value||'').toLowerCase();
  const cat = categorySelect.value || 'All';
  const filtered = list.filter(p => (p.name.toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q)) && (cat === 'All' || p.category === cat));
  productGrid.innerHTML = '';
  productCount.innerText = filtered.length + ' items';
  filtered.forEach(p => {
    const d = document.createElement('div'); d.className='product';
    d.innerHTML = `<strong>${p.name}</strong><div>${p.category}</div><div>₹${p.price}</div>`;
    d.addEventListener('click', () => openProduct(p));
    productGrid.appendChild(d);
  });
}

searchInput?.addEventListener('input', () => renderProducts(productsCache));
categorySelect?.addEventListener('change', () => renderProducts(productsCache));

// product modal
function openProduct(p) {
  modalName.innerText = p.name;
  modalCategory.innerText = 'Category: ' + p.category;
  modalPrice.innerText = 'Price: ₹' + p.price;
  modalGate.innerText = p.gate;
  modalBrokerArea.innerHTML = '';
  if (currentUser) {
    modalBrokerArea.innerHTML = `<p><strong>Broker:</strong> ${p.broker}</p>
      <button onclick="copyText('${p.broker}')">Copy Broker</button>
      <a href="tel:${p.broker}"><button>Call</button></a>`;
  } else {
    modalBrokerArea.innerHTML = `<p class="error">Broker dekhne ke liye login karein</p>`;
  }
  productModal.classList.remove('hidden');
}
closeModal?.addEventListener('click', () => productModal.classList.add('hidden'));

window.copyText = (txt) => navigator.clipboard.writeText(txt);

// ---------- Admin functions (if admin page) ----------
if (saveProdBtn) {
  let editId = null;
  saveProdBtn.addEventListener('click', async () => {
    prodMsg.innerText = '';
    const name = prodName.value.trim();
    const category = prodCategory.value.trim() || 'Uncategorized';
    const price = Number(prodPrice.value) || 0;
    const gate = prodGate.value.trim();
    const broker = prodBroker.value.trim();
    if (!name || !gate || !broker) { prodMsg.innerText = 'Name, Gate, Broker zaroori hai'; return; }
    try {
      if (editId) {
        await db.collection('products').doc(editId).update({ name, category, price, gate, broker });
      } else {
        await db.collection('products').add({ name, category, price, gate, broker, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      }
      prodName.value=''; prodCategory.value=''; prodPrice.value=''; prodGate.value=''; prodBroker.value='';
      editId = null;
    } catch (e) { prodMsg.innerText = e.message; }
  });

  // list admin products with edit/delete
  db.collection('products').orderBy('createdAt','desc').onSnapshot(snap => {
    adminProducts.innerHTML = '';
    snap.forEach(doc => {
      const p = { id: doc.id, ...doc.data() };
      const el = document.createElement('div'); el.className='product';
      el.innerHTML = `<strong>${p.name}</strong><div>${p.category}</div><div>₹${p.price}</div>
        <div class="row" style="margin-top:8px">
          <button class="btn-edit">Edit</button>
          <button class="btn-del">Delete</button>
        </div>`;
      el.querySelector('.btn-edit').addEventListener('click', () => {
        prodName.value = p.name; prodCategory.value = p.category; prodPrice.value = p.price; prodGate.value = p.gate; prodBroker.value = p.broker;
        editId = p.id;
      });
      el.querySelector('.btn-del').addEventListener('click', async () => {
        if (confirm('Delete product?')) await db.collection('products').doc(p.id).delete();
      });
      adminProducts.appendChild(el);
    });
  });
}
