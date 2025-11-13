import React, { useState, useRef, useEffect } from 'react';

const EmailLink = ({ email, subject = '', body = '', children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef();

  const handleClickOutside = e => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click 
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setIsOpen(false);
  };

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const outlookUrl = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div ref={node} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {children ? children : <span className="text-blue-600 hover:underline">{email}</span>}
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            <a href={mailtoHref} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Open in default app
            </a>
            <button onClick={copyToClipboard} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Copy to clipboard
            </button>
            <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Open in Gmail
            </a>
            <a href={outlookUrl} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Open in Outlook
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailLink;
