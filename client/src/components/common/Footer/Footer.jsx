const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-lg font-medium">
          &copy; {new Date().getFullYear()} MyApp. All rights reserved.
        </p>
        <div className="mt-4 space-x-6">
          {/* Optional social media links */}
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook"></i> {/* Replace with actual icon */}
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i> {/* Replace with actual icon */}
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i> {/* Replace with actual icon */}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
