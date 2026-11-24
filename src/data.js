export const CATS = [['office', 'Office Wear'], ['ethnic', 'Ethnic Wear'], ['night', 'Night Wear'], ['wedding', 'Wedding Wear']];
export const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const rows = [
['Zari Brocade Sherwani','men','wedding',14500,4.8,'Bestseller'],['Linen Nehru Jacket','men','office',3999,4.5,''],
['Handloom Kurta Set','men','ethnic',2800,4.7,'New'],['Silk Lounge Set','men','night',2499,4.4,''],
['Bandhgala Suit','men','office',8999,4.6,'Bestseller'],['Chikankari Kurta','men','ethnic',1999,4.5,''],
['Velvet Wedding Bandhgala','men','wedding',12999,4.9,''],['Cotton Night Kurta','men','night',1299,4.3,''],
['Emerald Silk Saree','women','wedding',9800,4.9,'Bestseller'],['Tailored Linen Blazer Set','women','office',4599,4.6,''],
['Banarasi Lehenga','women','wedding',18500,4.8,'New'],['Satin Night Robe','women','night',1899,4.5,''],
['Chanderi Anarkali','women','ethnic',3499,4.7,'Bestseller'],['Kalamkari Co-ord Set','women','office',2999,4.4,''],
['Ikat Silk Kurta Set','women','ethnic',2199,4.5,''],['Modal Night Set','women','night',1599,4.3,''],
['Ivory Linen Bandhgala','men','office',5499,4.6,'New'],['Charcoal Mandarin Suit','men','office',7499,4.7,''],
['Sand Wide-Leg Pant Suit','women','office',5299,4.6,'New'],['Indigo Printed Blazer Set','women','office',4299,4.5,'']];
export const PRODUCTS = rows.map(([name, gender, category, price, rating, tag], id) =>
  ({ id, name, gender, category, price, rating, tag, image: `/images/products/${slug(name)}.jpg` }));

// Demo-only auth stored in the browser. Replace these with API calls when you add a backend.
const users = () => JSON.parse(localStorage.getItem('vastra_users') || '[]');
export const auth = {
  register({ name, email, password }) {
    if (users().some(u => u.email === email.toLowerCase())) throw new Error('An account with this email already exists');
    localStorage.setItem('vastra_users', JSON.stringify([...users(), { name, email: email.toLowerCase(), password }]));
    return { name, email };
  },
  login({ email, password }) {
    const u = users().find(u => u.email === email.toLowerCase() && u.password === password);
    if (!u) throw new Error('Incorrect email or password');
    return { name: u.name, email: u.email };
  }
};

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
// Body measurements in inches
export const SIZE_CHART = {
  men: { head: ['Size', 'Chest', 'Waist', 'Shoulder', 'Length'], rows: [['S', '36', '30', '16.5', '27'], ['M', '38', '32', '17', '28'], ['L', '40', '34', '17.5', '29'], ['XL', '42', '36', '18', '30'], ['XXL', '44', '38', '18.5', '31']] },
  women: { head: ['Size', 'Bust', 'Waist', 'Hip', 'Length'], rows: [['S', '34', '28', '36', '38'], ['M', '36', '30', '38', '39'], ['L', '38', '32', '40', '40'], ['XL', '40', '34', '42', '41'], ['XXL', '42', '36', '44', '42']] }
};
