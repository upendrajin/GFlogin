import { useEffect } from 'react';
import axios from 'axios';

function FacebookLoginComponent() {
  useEffect(() => {
    // Facebook SDK initialization
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID, // .env માં KEY હોવો જોઈએ
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
    };

    // Load Facebook SDK script dynamically (optional here since it's in index.html)
    ((d, s, id) => {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(function (response) {
      if (response.authResponse) {
        const { accessToken, userID } = response.authResponse;

        // Async block inside sync function
        (async () => {
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
        })();
      }
    }, { scope: 'public_profile,email' });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button onClick={handleFacebookLogin}>Login with Facebook</button>
    </div>
  );
}

export default FacebookLoginComponent;
