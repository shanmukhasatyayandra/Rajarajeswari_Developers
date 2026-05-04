import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../apiConfig';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [propertyType, setPropertyType] = useState('House');
  
  // Image handling
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProperties();
  }, [token, navigate]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/properties/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('city', city);
    formData.append('fullAddress', fullAddress);
    formData.append('fullDescription', fullDescription);
    formData.append('propertyType', propertyType);

    if (isEditing) {
        formData.append('existingImages', JSON.stringify(existingImages));
        if (newImages) {
            for (let i = 0; i < newImages.length; i++) {
                formData.append('newImages', newImages[i]);
            }
        }
    } else {
        if (newImages) {
            for (let i = 0; i < newImages.length; i++) {
                formData.append('images', newImages[i]);
            }
        }
    }

    const url = isEditing 
      ? `${API_URL}/api/properties/${editId}` 
      : `${API_URL}/api/properties`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData // No content-type header, fetch sets it to multipart/form-data with boundary
      });
      
      if (res.ok) {
        resetForm();
        fetchProperties();
      } else {
        alert('Failed to save property');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle('');
    setPrice('');
    setCity('');
    setFullAddress('');
    setFullDescription('');
    setPropertyType('House');
    setExistingImages([]);
    setNewImages(null);
    document.getElementById('image-upload').value = '';
  };

  const handleEdit = (prop) => {
    setIsEditing(true);
    setEditId(prop._id);
    setTitle(prop.title);
    setPrice(prop.price);
    setCity(prop.city);
    setFullAddress(prop.fullAddress || '');
    setFullDescription(prop.fullDescription || '');
    setPropertyType(prop.propertyType || 'House');
    setExistingImages(prop.images || []);
    setNewImages(null);
    document.getElementById('image-upload').value = '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      const res = await fetch(`${API_URL}/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const removeExistingImage = (index) => {
      const updated = [...existingImages];
      updated.splice(index, 1);
      setExistingImages(updated);
  };

  return (
    <div className="fade-in">
      <h1 style={{ color: 'var(--primary-color)', marginBottom: '30px' }}>Admin Dashboard</h1>
      
      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Form Section */}
        <div className="admin-form" style={{ alignSelf: 'start', margin: 0 }}>
          <h3>{isEditing ? 'Edit Property' : 'Add New Property'}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" className="form-control" value={title} onChange={e=>setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" className="form-control" value={price} onChange={e=>setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Property Type</label>
              <select className="form-control" value={propertyType} onChange={e=>setPropertyType(e.target.value)} required>
                <option value="Plot">Plot</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div className="form-group">
              <label>Property Place (Publicly Visible)</label>
              <input type="text" className="form-control" value={city} onChange={e=>setCity(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Full Address (Hidden from Public)</label>
              <input type="text" className="form-control" value={fullAddress} onChange={e=>setFullAddress(e.target.value)} required />
            </div>
            
            <div className="form-group" style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
              <label style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Upload Images</label>
              <input 
                id="image-upload"
                type="file" 
                multiple 
                accept="image/*"
                onChange={e=>setNewImages(e.target.files)} 
                className="form-control" 
                style={{ border: 'none', padding: '10px 0' }}
              />
              <small style={{ color: 'var(--text-muted)' }}>You can select multiple images.</small>

              {isEditing && existingImages.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                      <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Existing Images:</p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {existingImages.map((img, i) => (
                              <div key={i} style={{ position: 'relative' }}>
                                  <img src={img.startsWith('http') ? img : `${API_URL}${img}`} alt="property" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                  <button type="button" onClick={() => removeExistingImage(i)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>×</button>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>

            <div className="form-group">
              <label>Full Description (Hidden from Public)</label>
              <textarea className="form-control" value={fullDescription} onChange={e=>setFullDescription(e.target.value)} rows="5" required placeholder="Write a detailed description here. The first few lines will be automatically used as a short teaser for the public." />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>
              {isEditing ? 'Save Changes' : 'Publish Property'}
            </button>
            {isEditing && (
              <button type="button" className="btn-danger" style={{ width: '100%', marginTop: '10px' }} onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* List Section */}
        <div className="property-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Manage Properties</h3>
            <input 
              type="text" 
              placeholder="Search by Title..." 
              className="form-control" 
              style={{ maxWidth: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {loading ? <p>Loading...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {properties
                .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(prop => (
                <div key={prop._id} style={{ background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <img 
                        src={prop.images && prop.images.length > 0 
                            ? (prop.images[0].startsWith('http') ? prop.images[0] : `${API_URL}${prop.images[0]}`) 
                            : 'https://via.placeholder.com/60'} 
                        alt="thumb" 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                    <div>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '5px' }}>{prop.title}</h4>
                        <p style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>₹{prop.price}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Place: {prop.city} | {prop.propertyType}</p>
                    </div>
                  </div>
                  <div>
                    <button onClick={() => handleEdit(prop)} className="btn-primary" style={{ marginRight: '10px', padding: '6px 12px', fontSize: '0.85rem' }}>Edit</button>
                    <button onClick={() => handleDelete(prop._id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Delete</button>
                  </div>
                </div>
              ))}
              {properties.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No properties found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
