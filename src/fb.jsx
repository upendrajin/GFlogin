// src/FacebookLoginComponent.jsx
import { useEffect } from 'react';
import axios from 'axios';

function FacebookLoginComponent() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0',
      });
    };

    // Load Facebook SDK
    ((d, s, id) => {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      async (response) => {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          try {
            const res = await axios.post('http://localhost:3001/api/users/oauth/facebook', {
              accessToken,
              userId: userID,
            });
            console.log('✅ Facebook login success:', res.data);
            localStorage.setItem('userToken', res.data.userToken);
          } catch (err) {
            console.error('❌ Facebook login error:', err.response?.data || err.message);
          }
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button onClick={handleFacebookLogin}>Login with Facebook</button>
    </div>
  );
}

export default FacebookLoginComponent;
