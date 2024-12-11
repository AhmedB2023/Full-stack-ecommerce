import React from 'react';

function Home({ user }) {
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            {user ? (
                <h2>Welcome, {user.username}!</h2>
            ) : (
                <h2>Please log in to continue.</h2>
            )}
        </div>
    );
}

export default Home;
