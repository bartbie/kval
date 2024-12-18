const Button: React.FC<{ children: string }> = ({ children }) => (
  <button className="rounded-lg border border-transparent px-4 py-2 text-base transition-colors focus:outline focus:outline-4 focus:outline-[auto] focus:outline-webkit-focus-ring-color hover:border-[#646cff]">
    {children}
  </button>
);

export default () => {
  return (
    <header className="fixed top-0 w-full shadow-md z-50 flex items-center justify-between p-2">
      Musik Sampsil
      <nav>
        <Button>Log in</Button>
        <Button>Sign in</Button>
      </nav>
    </header>
  );
};
