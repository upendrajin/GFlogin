import { useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post('http://localhost:3001/api/users/oauth/google', {
        token: response.credential,
      });
      console.log('✅ Google login success:', res.data);
      localStorage.setItem('userToken', res.data.userToken);
    } catch (err) {
      console.error('❌ Google login error:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    // Facebook SDK init
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
    };

    // Google Login init
    const initializeGoogle = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-login-btn'),
          { theme: 'outline', size: 'large' }
        );
      } else {
        setTimeout(initializeGoogle, 300);
      }
    };

    initializeGoogle();
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      async function (response) {
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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>React 19 + Vite Social Login</h1>

      <div style={{ margin: '20px' }}>
        <div id="google-login-btn">
          <button disabled>Loading Google Login...</button>
        </div>
      </div>

      <div style={{ margin: '20px' }}>
        <button onClick={handleFacebookLogin}>Login with Facebook</button>
      </div>
    </div>
  );
}

export default App;
