import { useEffect, useRef } from 'react';
import contactPageHtml from './contact-page-section.html?raw';
import './contact-page-overrides.css';

export function ContactPageSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = contactPageHtml;
    const inertScript = container.querySelector('script');
    if (!inertScript) {
      throw new Error('The supplied Contact page section is missing its script.');
    }

    const activeScript = document.createElement('script');
    activeScript.textContent = inertScript.textContent;
    inertScript.replaceWith(activeScript);
  }, []);

  return <div className="ct-page-section" ref={containerRef} />;
}
