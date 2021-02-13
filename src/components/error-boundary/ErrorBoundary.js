import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true, error};
    }

    componentDidCatch(error, errorInfo) {
        console.error('Somethign went Wrong !', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div>
                <h1>Something went wrong.</h1>
                <p>{JSON.stringify(this.state.error.stack)}</p>
            </div>;
        }

        return this.props.children;
    }
}