import CardComponent from '../components/CardComponent';

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <CardComponent apiEndpoint="http://localhost:5000/api/data" />
      {/* Add more content as needed */}
    </div>
  );
}

export default HomePage;
