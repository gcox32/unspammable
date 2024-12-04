import Image from 'next/image';
import { useState } from 'react';

interface AvatarPreviewProps {
  url: string;
  name: string;
}

export default function AvatarPreview({ url, name }: AvatarPreviewProps) {
  const [error, setError] = useState(false);

  // If URL is invalid, fall back to UI Avatars
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  
  return (
    <div className="avatar-preview">
      <Image
        src={error ? fallbackUrl : url || fallbackUrl}
        alt="Avatar preview"
        width={100}
        height={100}
        className="avatar-image"
        onError={() => setError(true)}
      />
    </div>
  );
} 