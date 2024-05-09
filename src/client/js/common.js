const msgAlert = (position, msg, type) => {
  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: 2000,
  });
  Toast.fire({ title: msg, icon: type });
};
