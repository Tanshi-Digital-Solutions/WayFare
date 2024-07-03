import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wayfare_backend } from 'declarations/wayfare_backend';
import user_icon from './Assets/person.png';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';
import './index.scss';
import Notification from './Notification';

const App = () => {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();  // Initialize useNavigate hook

  const handleSubmit = async (event) => {
    event.preventDefault();
    let result;
    if (action === "Sign up") {
      result = await wayfare_backend.createUser(name, email, password);
    } else {
      result = await wayfare_backend.login(email, password);
    }
    handleResult(result);
  };

  const handleResult = (result) => {
    if ('ok' in result) {
      showNotification(result.ok, 'success');
      if (action === "Login") {
        navigate('/dashboard');  // Navigate to the Dashboard page upon successful login
      }
    } else if ('err' in result) {
      showNotification(result.err, 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <div className='container'>
      <Notification message={notification.message} type={notification.type} show={notification.show} />
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          {action === "Login" ? null : (
            <div className="input">
              <img src={user_icon} alt="User Icon" />
              <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div className="input">
            <img src={email_icon} alt="Email Icon" />
            <input type="email" placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input">
            <img src={password_icon} alt="Password Icon" />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        {action === "Sign up" ? null : (
          <div className="forgot-password">Forgot Password?</div>
        )}
        <div className="submit-container">
          <div className="action-buttons">
            <button type="button" className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign up")}>Sign up</button>
            <button type="button" className={action === "Sign up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</button>
          </div>
          <button type="submit" className="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default App;
