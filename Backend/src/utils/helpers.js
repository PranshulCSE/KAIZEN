   const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

   const generateToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

   const formatError = (error) => {
  if (error.isOperational) {
    return {
      status: error.statusCode,
      message: error.message
    };
  }

  return {
    status: 500,
    message: 'Something went wrong! Please try again later.'
  };
};

   const isValidEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

   const calculateScore = (matched, total) => {
  if (total === 0) return 0;
  return Math.round((matched / total) * 100);
};


module.exports = {
    generateOTP,
    generateToken,
    formatError,
    isValidEmail,
    calculateScore
}