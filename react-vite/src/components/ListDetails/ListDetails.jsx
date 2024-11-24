
import './ListDetails.css';

export default function ListDetails({ list }) {
  return (
    <div className="list">
      <div className="list-header">
        <h3>{list.title}</h3>
      </div>
      
      <div className="cards-container">
        {/* Cards will be added here later */}
      </div>
    </div>
  );
}