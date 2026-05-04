import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import './Home.css';
import API_URL from '../apiConfig';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [search, setSearch] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (minPrice) query.append('minPrice', minPrice);
      if (maxPrice) query.append('maxPrice', maxPrice);
      if (city) query.append('city', city);
      if (propertyType) query.append('propertyType', propertyType);
      if (search) query.append('search', search);

      const res = await fetch(`${API_URL}/api/properties?${query.toString()}`);
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []); // Initial load

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="home-page fade-in">
      <div className="hero-section">
        <h1>Find Your Perfect Property</h1>
        <p>Premium real estate with Raja Rajeswari Developers</p>
      </div>

      <form className="filter-bar" onSubmit={handleFilter}>
        <input 
          type="text" 
          placeholder="Search by Title" 
          className="form-control" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Min Price" 
          className="form-control" 
          value={minPrice} 
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Max Price" 
          className="form-control" 
          value={maxPrice} 
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Property Place" 
          className="form-control" 
          value={city} 
          onChange={(e) => setCity(e.target.value)}
        />
        <select 
          className="form-control" 
          value={propertyType} 
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Plot">Plot</option>
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
          <option value="Commercial">Commercial</option>
        </select>
        <button type="submit" className="btn-primary">Search</button>
      </form>



      {loading ? (
        <div className="loading">Loading properties...</div>
      ) : (
        <div className="property-grid">
          {properties.length > 0 ? (
            properties.map(prop => (
              <PropertyCard key={prop._id} property={prop} />
            ))
          ) : (
            <div className="no-results">No properties found matching your criteria.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
