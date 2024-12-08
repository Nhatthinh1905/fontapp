
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return "Vui lòng nhập một địa chỉ email hợp lệ.";
  }
  return null; 
};

export const validateName = (name: string): string | null => {
  if (name.length < 8) {
    return "Tên phải có ít nhất 8 ký tự.";
  }
  return null;
};


  
export const validatePassword = (password: string): string | null => {
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return "Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ cái viết hoa.";
  }
  return null; 
};
