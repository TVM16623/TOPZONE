import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';


export default {
    success: (text) => {
        Toastify({
            text,
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            style: {
                background: 'hsl(217, 71%, 53%)'
            }
        }).showToast();
    },
    error: (text, _gravity = 'bottom', _position = 'center', timeout = 3000) => {
        Toastify({
            text,
            duration: timeout,
            gravity: _gravity,
            position: _position,
            style: {
                background: 'hsl(348, 86%, 61%)'
            }
        }).showToast();
    }
}
