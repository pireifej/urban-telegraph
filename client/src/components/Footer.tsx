export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Urban-Telegraph</h3>
            <p className="text-primary-foreground/80">
              Your source for urban insights, reviews, and stories from the heart of the city.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground">Urban Life</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Food Reviews</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Technology</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Culture</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground">Our Story</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Writers</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Contact</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
          <p>&copy; 2024 Urban-Telegraph. All rights reserved.</p>
          <p className="mt-2">
            <a 
              href="https://www.shouldcallpaul.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              Website designed by Developer and Public Speaker, Paul Ireifej
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}