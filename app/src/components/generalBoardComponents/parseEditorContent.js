export default function parseEditorContent(data) {
  if (!data || !data.blocks || !Array.isArray(data.blocks)) return '';

  return data.blocks.map(block => {
    const { type, data } = block;
    console.log(type,data)
    switch (type) {
      case 'header':{
        const level = data.level || 1;
        return `<h${level}>${data.text}</h${level}>`;
      }
      case 'paragraph':{
        return `<p>${data.text}</p>`;
      }
      case 'checkList':{
        return (
          `<ul class="checklist">` +
          data.items
            .map(
              item =>
                `<li>
                  <label class="check-item">
                    <input type="checkbox" ${item.checked ? 'checked' : ''} disabled/>
                    <span class="custom-check"></span>
                    <span class="check-label">${item.text}</span>
                  </label>`
            ).join('')+
          `</ul>`
        );
      }
      case 'image':{
        return `
          <figure class="image-block">
            <img class="image-src" src="${data.file?.url}" alt="${data.caption || ''}" />
            ${data.caption ? `<figcaption class="image-alt">${data.caption}</figcaption>` : ''}
          </figure>
        `;
      }
      case 'attaches':{
        return `<a class='file' href="${data.file.url}" target="_blank">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
  <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
</svg><span class="filename">${data.title}</span>
        </a>`;
      }
case 'youtubeEmbed': {
  // 유튜브 링크만 감싼다고 가정
  const videoId = data.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
  if (!videoId) return '';
  return `
    <div class="video-wrapper">
      <iframe 
        src="https://www.youtube.com/embed/${videoId}" 
        frameborder="0" 
        allowfullscreen>
      </iframe>
    </div>`;
}

      default:{
        return '';
        }
    }
  }).join('');
}
