import '../styles/QueueStackDisplay.css';

/**
 * QueueStackDisplay Component
 * Shows the current state of queue or stack
 */
function QueueStackDisplay({ data, type, title }) {
  if (!data || data.length === 0) {
    return (
      <div className="queue-stack-display">
        <h3 className="display-title">{title || (type === 'queue' ? 'Queue' : 'Stack')}</h3>
        <div className="container empty">
          <p className="empty-message">Empty</p>
        </div>
      </div>
    );
  }

  const displayData = type === 'stack' ? [...data].reverse() : data;

  return (
    <div className="queue-stack-display">
      <h3 className="display-title">{title || (type === 'queue' ? 'Queue' : 'Stack')}</h3>
      <div className={`container ${type}`}>
        {displayData.map((item, index) => {
          const displayIndex = type === 'stack' ? data.length - 1 - index : index;
          const isTop = type === 'stack' ? index === 0 : index === 0;
          const isBottom = type === 'queue' ? index === data.length - 1 : index === displayData.length - 1;
          
          return (
            <div
              key={`${type}-item-${index}`}
              className={`item ${isTop ? 'top' : ''} ${isBottom ? 'bottom' : ''}`}
            >
              {typeof item === 'object' ? (
                <>
                  <span className="item-node">Node: {item.node}</span>
                  {item.dist !== undefined && (
                    <span className="item-dist">Dist: {item.dist}</span>
                  )}
                </>
              ) : (
                <span className="item-value">{item}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QueueStackDisplay;

