# Práctica 1 · Limpieza de código viejo

Fragmento tomado de mi proyecto de clase `proyectoclaseMarioSoler` (`src/pages/Login.js`).

## Código original

```jsx
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [inputError, setInputError] = useState(null);
  const navigate = useNavigate();

  const handleOnClick =()=>{
    console.log("valor de email: " + email);
  }
  const handleOnSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  }
  const handleOnBlur = () => {
    if(email.includes('@')) {
      setInputError(null);
    } else{
      setInputError('Correo invalido.');
    }
  }
  // ... JSX con style={{ height: '100vh' }} y style={{ width: '300px' }}
}
```

## Smells que ahora veo

1. **Código muerto:** `useEffect` se importa y nunca se usa.
2. **Código muerto / debug olvidado:** `handleOnClick` solo hace `console.log` del correo; no aporta nada en producción y además expone datos del usuario en consola.
3. **Nombres que no revelan intención:** `handleOnClick`, `handleOnBlur` y `handleOnSubmit` dicen *cuándo* se ejecutan, no *qué* hacen.
4. **Regla de negocio escondida:** la validación del correo vive dentro del `onBlur`, y el `submit` navega **sin volver a validar**: se puede entrar con un correo inválido.
5. **Strings y números mágicos:** `'Correo invalido.'`, `'/'`, `'100vh'`, `'300px'` sueltos en el código.
