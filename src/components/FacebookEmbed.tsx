import React from 'react';

interface Props {
    url: string;
}

export const FacebookEmbed: React.FC<Props> = ({ url }) => {
    // Extract page path or name from the full URL
    // e.g., https://www.facebook.com/wellingtonspeedway -> wellingtonspeedway
    const encodedUrl = encodeURIComponent(url);

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[500px] h-[600px] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border-4 border-slate-800 relative">
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold text-sm animate-pulse">
                    Loading social updates...
                </div>
                <iframe
                    src={`https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
                    width="500"
                    height="600"
                    style={{ border: 'none', overflow: 'hidden' }}
                    className="relative z-10 w-full h-full"
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Facebook Feed"
                ></iframe>
            </div>
        </div>
    );
};
