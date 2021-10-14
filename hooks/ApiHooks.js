import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {doFetch} from '../utils/http';
import {appID, baseUrl} from '../utils/variables';

const useMedia = (ownFiles) => {
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const {update, user} = useContext(MainContext);

  useEffect(() => {
    // https://scriptverse.academy/tutorials/js-self-invoking-functions.html
    (async () => {
      const allMedia = await loadMedia();
      setMediaArray(allMedia.reverse());
      // console.log('useMedia useEffect', mediaArray);
    })();
  }, [update]);

  const loadMedia = async (ownLikedFiles) => {
    try {
      let mediaIlmanThumbnailia = await useTag().getFilesByTag(appID);

      if (ownFiles) {
        mediaIlmanThumbnailia = mediaIlmanThumbnailia.filter(
          (item) => item.user_id === user.user_id
        );
      }

      if (ownLikedFiles) {
        console.log('Löytyy tykkäyksiä');
        mediaIlmanThumbnailia = mediaIlmanThumbnailia.filter((item) => {
          const likedFiles = ownLikedFiles.filter((file) => {
            if (file.file_id === item.file_id) {
              return file;
            }
          });

          console.log('testi', item.file_id, likedFiles);
          if (likedFiles.length > 0) {
            return item;
          }
        });
      }

      const kaikkiTiedot = mediaIlmanThumbnailia.map(async (media) => {
        const file = await loadSingleMedia(media.file_id);
        return file;
      });

      // console.log('comments', comments);

      return Promise.all(kaikkiTiedot);
    } catch (e) {
      console.log('loadMedia', e.message);
    }
  };

  const loadSingleMedia = async (id) => {
    try {
      const tiedosto = await doFetch(baseUrl + 'media/' + id);
      return tiedosto;
    } catch (e) {
      console.log('loadSingleMedia', e.message);
      return {};
    }
  };

  const uploadMedia = async (formData, token) => {
    try {
      setLoading(true);
      const options = {
        method: 'POST',
        headers: {
          'x-access-token': token,
        },
        body: formData,
      };
      console.log('formSSSS', formData);
      const result = await doFetch(baseUrl + 'media', options);
      return result;
    } catch (e) {
      console.log('uploadMedia error', e);
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const modifyMedia = async (data, token, id) => {
    try {
      setLoading(true);
      console.log('form', data);
      const options = {
        method: 'PUT',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      console.log('osoite', baseUrl + 'media/' + id);
      const result = await doFetch(baseUrl + 'media/' + id, options);
      return result;
    } catch (e) {
      console.log('modifyMedia error', e);
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (id, token) => {
    try {
      setLoading(true);
      const options = {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
        },
      };
      const result = await doFetch(baseUrl + 'media/' + id, options);
      return result;
    } catch (e) {
      console.log('deleteMedia error', e);
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (id) => {
    try {
      const commentsByFileId = await doFetch(baseUrl + 'comments/file/' + id);
      return commentsByFileId;
    } catch (e) {
      console.log('get comments by file id', e.message);
    }
  };

  const uploadComment = async (data, token) => {
    try {
      setLoading(true);
      const options = {
        method: 'POST',
        headers: {'x-access-token': token, 'Content-type': 'application/json'},
        body: data,
      };
      const result = await doFetch(baseUrl + 'comments', options);
      return result;
    } catch (e) {
      console.log('uploadMedia error', e);
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const deleteComment = await doFetch(
        baseUrl + '/comments/' + fileId,
        options
      );
      return deleteComment;
    } catch (error) {
      console.log('deleteComment error', error);
    }
  };

  return {
    mediaArray,
    loading,
    loadMedia,
    loadSingleMedia,
    uploadMedia,
    deleteMedia,
    modifyMedia,
    loadComments,
    uploadComment,
    deleteComment,
  };
};

const useLogin = () => {
  const login = async (userCredentials) => {
    const requestOptions = {
      method: 'POST',
      // mode: 'no-cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    try {
      const loginResponse = await doFetch(baseUrl + 'login', requestOptions);
      return loginResponse;
    } catch (error) {
      console.log('login error', error.message);
    }
  };
  return {login};
};

const useUser = () => {
  const checkToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      const userInfo = await doFetch(baseUrl + 'users/user', options);
      return userInfo;
    } catch (error) {
      console.log('checkToken error', error);
    }
  };
  const getUserInfo = async (userId, token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      const userInfo = await doFetch(baseUrl + 'users/' + userId, options);
      // console.log('getUserInfo', getUserInfo, userId);
      // console.log('getUserInfo', userId);
      return userInfo;
    } catch (e) {
      console.log('checkToken error', e);
    }
  };

  const getCurrentUserInfo = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      const userInfo = await doFetch(baseUrl + 'users/user', options);
      return userInfo;
    } catch (e) {
      console.log('checkToken error', e);
    }
  };

  const checkUsernameAvailable = async (username) => {
    try {
      const usernameInfo = await doFetch(
        baseUrl + 'users/username/' + username
      );
      return usernameInfo.available;
    } catch (error) {
      console.log('checkUsername error', error);
    }
  };

  const register = async (userCredentials) => {
    // https://media.mw.metropolia.fi/wbma/docs/#api-User-PostUser
    const requestOptions = {
      method: 'POST',
      // mode: 'no-cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    try {
      const registerResponse = await doFetch(baseUrl + 'users', requestOptions);
      return registerResponse;
    } catch (error) {
      console.log('register error', error.message);
    }
  };

  return {
    checkToken,
    register,
    checkUsernameAvailable,
    getUserInfo,
    getCurrentUserInfo,
  };
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      const tiedosto = await doFetch(baseUrl + 'tags/' + tag);
      return tiedosto;
    } catch (e) {
      console.log('getFilesByTag', e.message);
      return {};
    }
  };

  // eslint-disable-next-line camelcase
  const addTag = async (file_id, tag, token) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({file_id, tag}),
    };
    // console.log('optiot', options);
    try {
      const tagInfo = await doFetch(baseUrl + 'tags', options);
      return tagInfo;
    } catch (error) {
      // console.log('addTag error', error);
      throw new Error(error.message);
    }
  };

  return {getFilesByTag, addTag};
};

const useFavourites = () => {
  const addFavourite = async (fileId, token) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token, 'Content-type': 'application/json'},
      body: JSON.stringify({
        file_id: fileId,
      }),
    };

    try {
      const addFavourite = await doFetch(baseUrl + 'favourites', options);
      console.log('Body: ', options.body);
      return addFavourite;
    } catch (e) {
      console.log('addFavourite error', e.message);
    }
  };

  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const deleteFavourite = await doFetch(
        baseUrl + 'favourites/file/' + fileId,
        options
      );
      return deleteFavourite;
    } catch (error) {
      console.log('deleteFavourite error', error);
    }
  };

  const getFavouritesByFileId = async (fileId) => {
    const options = {
      method: 'GET',
    };
    try {
      const favouritesByFileId = await doFetch(
        baseUrl + 'favourites/file/' + fileId,
        options
      );
      return favouritesByFileId;
    } catch (error) {
      console.log('checkToken error', error);
    }
  };

  const getMyFavourites = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      const myFavourites = await doFetch(baseUrl + 'favourites', options);
      return myFavourites;
    } catch (error) {
      console.log('checkToken error', error);
    }
  };

  return {
    addFavourite,
    deleteFavourite,
    getFavouritesByFileId,
    getMyFavourites,
  };
};

export {useMedia, useLogin, useUser, useTag, useFavourites};
