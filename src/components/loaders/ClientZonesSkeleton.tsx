import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ClientZonesSkeleton() {
  return (
    <div className="client-zones-page">
      <div className="content-layout">
        <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
          {/* Client Zones List Skeleton */}
          <div className="client-zones-list">
            <h3 className="list-title">
              <Skeleton width={180} height={24} />
            </h3>
            <div className="clients-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="client-card">
                  <div className="client-header">
                    <div className="client-info">
                      <Skeleton circle width={16} height={16} style={{ marginRight: '8px' }} />
                      <Skeleton width={120} height={20} />
                    </div>
                  </div>
                  <div className="client-actions">
                    <Skeleton width={100} height={32} />
                  </div>
                  <div className="client-details">
                    <Skeleton width="100%" height={40} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Section Skeleton */}
          <div className="map-section">
            <div className="map-header">
              <h3>
                <Skeleton width={150} height={24} />
              </h3>
            </div>
            <div className="client-zones-map-container">
              <Skeleton 
                width="100%" 
                height={600} 
                style={{ border: '1px solid #ccc', borderRadius: '8px' }} 
              />
            </div>
          </div>
        </SkeletonTheme>
      </div>
    </div>
  );
}

