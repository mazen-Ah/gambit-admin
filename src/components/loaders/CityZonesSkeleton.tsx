import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CityZonesSkeleton() {
  return (
    <div className="city-zones-page">
      <div className="content-layout">
        <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
          {/* City Zones List Skeleton */}
          <div className="city-zones-list">
            <h3 className="list-title">
              <Skeleton width={180} height={24} />
            </h3>
            <div className="clients-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="client-card">
                  <div className="client-header">
                    <div className="client-name">
                      <Skeleton width={150} height={20} />
                    </div>
                  </div>
                  <div className="client-details">
                    <div className="detail-item">
                      <Skeleton width="45%" height={16} />
                      <Skeleton width="45%" height={16} />
                    </div>
                    <div className="detail-item">
                      <Skeleton width="40%" height={16} />
                      <Skeleton width="50%" height={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cities Section Skeleton */}
          <div className="cities-section">
            <div className="cities-header">
              <h3>
                <Skeleton width={120} height={24} />
              </h3>
            </div>
            
            {/* Accordion Items Skeleton */}
            <div className="cities-accordion-skeleton">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="city-accordion-item">
                  <div style={{ 
                    backgroundColor: '#000', 
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <Skeleton 
                      width={200} 
                      height={20} 
                      baseColor="#333" 
                      highlightColor="#444"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button Skeleton */}
            <div className="form_button reverse" style={{ marginTop: '2rem' }}>
              <Skeleton width={150} height={40} borderRadius={4} />
            </div>
          </div>
        </SkeletonTheme>
      </div>
    </div>
  );
}

