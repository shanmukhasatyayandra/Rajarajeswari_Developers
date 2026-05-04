import React, { useState } from 'react';
import './PropertyCard.css';
import API_URL from '../apiConfig';

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const adminNumber = '9121999969';
  const message = `Hello, I am interested in ${property.title} located in ${property.city}. Please share complete details.`;
  const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;

  const images = property.images && property.images.length > 0 
    ? property.images.map(img => img.startsWith('http') ? img : `${API_URL}${img}`) 
    : ['https://via.placeholder.com/400x300?text=No+Image'];

  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="property-card fade-in">
      <div className="card-image-wrapper">
        <img 
          src={images[currentImageIndex]} 
          alt={`${property.title} - ${currentImageIndex + 1}`} 
          className="card-image"
        />
        
        {images.length > 1 && (
          <>
            <button onClick={handlePrev} className="slider-btn slider-btn-prev">‹</button>
            <button onClick={handleNext} className="slider-btn slider-btn-next">›</button>
            <div className="slider-dots">
              {images.map((_, idx) => (
                <span key={idx} className={`slider-dot ${idx === currentImageIndex ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}
        
        <div className="card-badge">Limited Details</div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <span className="card-type">{property.propertyType}</span>
          <span className="card-city"><i className="icon-marker"></i> Place: {property.city}</span>
        </div>
        <h3 className="card-title">{property.title}</h3>
        <p className="card-price">₹{property.price.toLocaleString('en-IN')}</p>
        <p className="card-teaser">{property.teaser}</p>
        
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary contact-btn">
          Contact Admin for Full Details
        </a>
      </div>
    </div>
  );
};

export default PropertyCard;
