import React from 'react';
import Image from 'next/image';

interface BlockProps {
  block: any;
}

export default function NotionBlockRenderer({ block }: BlockProps) {
  const { type, id } = block;

  const renderRichText = (richText: any[]) => {
    return richText.map((text: any, index: number) => (
      <span
        key={`${id}-${index}`}
        className={`${text.annotations.bold ? 'font-bold' : ''} 
                   ${text.annotations.italic ? 'italic' : ''} 
                   ${text.annotations.strikethrough ? 'line-through' : ''} 
                   ${text.annotations.underline ? 'underline' : ''} 
                   ${text.annotations.code ? 'font-mono bg-gray-100 rounded px-1' : ''}`}
      >
        {text.text.content}
      </span>
    ));
  };

  switch (type) {
    case 'paragraph':
      return (
        <p className="mb-4">
          {renderRichText(block.paragraph.rich_text)}
        </p>
      );

    case 'heading_1':
      return (
        <h1 className="text-3xl font-bold mb-4" id={id}>
          {block.heading_1.rich_text[0]?.text?.content || ''}
        </h1>
      );

    case 'heading_2':
      return (
        <h2 className="text-2xl font-bold mb-3" id={id}>
          {block.heading_2.rich_text[0]?.text?.content || ''}
        </h2>
      );

    case 'heading_3':
      return (
        <h3 className="text-xl font-bold mb-2" id={id}>
          {block.heading_3.rich_text[0]?.text?.content || ''}
        </h3>
      );

    case 'bulleted_list_item':
      return (
        <li key={id} className="ml-6 mb-1 list-disc">
          {renderRichText(block.bulleted_list_item.rich_text)}
        </li>
      );

    case 'numbered_list_item':
      return (
        <li key={id} className="ml-6 mb-1 list-decimal">
          {renderRichText(block.numbered_list_item.rich_text)}
        </li>
      );

    case 'image':
      const imageUrl = block.image.url;
      const caption = block.image.caption?.length > 0 
        ? block.image.caption[0].plain_text 
        : '';
      return (
        <figure key={id} className="my-8">
          <div className="relative h-96 w-full">
            <Image
              src={imageUrl}
              alt={caption}
              fill
              className="object-contain"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      );

    case 'embed':
      return (
        <div key={id} className="my-8">
          <iframe
            src={block.embed.url}
            className="w-full h-96 border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    case 'video':
      return (
        <div key={id} className="my-8">
          <iframe
            src={block.video.url}
            className="w-full h-96 border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    case 'file':
      return (
        <div key={id} className="my-4">
          <a
            href={block.file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            📎 {block.file.caption?.[0]?.plain_text || "Download file"}
          </a>
        </div>
      );

    default:
      return (
        <div key={id} className="text-sm text-gray-500 my-4">
          Unsupported block type: {type}
        </div>
      );
  }
} 