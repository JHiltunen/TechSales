import {useEffect, useState} from 'react';
import {baseUrl} from '../utils/variables';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);

  useEffect(() => {
    (async () => {
      setMediaArray(await loadMedia());
    })();
  }, []);

  const loadMedia = async () => {
    try {
      const response = await fetch(baseUrl + 'media');
      const mediaWithoutThumbnail = await response.json();
      const allFiles = mediaWithoutThumbnail.map(async (media) => {
        return await loadSingleMedia(media.file_id);
      });
      return Promise.all(allFiles);
    } catch (e) {
      console.log(e.message);
    }
  };

  const loadSingleMedia = async (id) => {
    const response = await fetch(baseUrl + 'media/' + id);
    const file = await response.json();
    return file;
  };

  return {mediaArray, loadSingleMedia, loadMedia};
};

export {useMedia};
