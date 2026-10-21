import React from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationCenter, ProductLogo } from '../src/NotificationCenter';
import { SAMPLE_NOTIFICATIONS, EMPTY_IMAGES } from '../src/sampleNotifications';
import '../src/NotificationCenter.css';
import viewport from '../src/assets/demo-viewport.jpg';

function App() {
  return (
    <div className="demo-app">
      <header className="demo-top">
        <div className="demo-left">
          <ProductLogo name="chaos-logo" size={20} />
          <span className="demo-sep" aria-hidden="true" />
          <ProductLogo name="enscape" size={20} />
          <span className="demo-title">Garden house — dusk</span>
          <span className="demo-res">1920 × 1080</span>
        </div>
        <div className="demo-right">
          <NotificationCenter
            items={SAMPLE_NOTIFICATIONS}
            emptyImages={EMPTY_IMAGES}
            defaultOpen
            onEvent={(type, payload) => console.log('[notifications]', type, payload)}
            onOpenItem={(item, target) => console.log('[notifications] open', item.id, target)}
          />
          <span className="demo-avatar" aria-label="Kremena P.">KP</span>
        </div>
      </header>
      <img className="demo-viewport" src={viewport} alt="Viewport showing the garden house render at dusk" />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
