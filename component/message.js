import swal from 'sweetalert';

const message = (body, title, type='success') => 
swal(title, body, type,{
    button: "ACEPTAR",
    timer: 3000,
    closeOnEsc: true
});

export default message;