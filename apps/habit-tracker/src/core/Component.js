/**
 * Base Component Class
 */
export class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this.element = null;
    }

    /**
     * Initialize component and return HTML element
     */
    render() {
        if (this.element) return this.element;

        const template = this.template();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = template.trim();
        this.element = tempDiv.firstElementChild;

        this.afterRender();
        return this.element;
    }

    /**
     * Template string to be overridden
     */
    template() {
        return '<div>Basic Component</div>';
    }

    /**
     * Hook called after element is created
     */
    afterRender() {
        // Add event listeners here
    }

    /**
     * Update component state and re-render if needed
     * Note: This is a simple implementation. In a real Virtual DOM, diffing would happen.
     * Here we might just replace innerHTML or update specific bindings.
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.update();
    }

    /**
     * Re-render logic
     */
    update() {
        if (!this.element) return;
        const newTemplate = this.template();
        // Naive update: replace content
        // In a better version, we would use a lightweight diffing library
        // For now, we assume components handle their own granular updates via afterRender/subscriptions
    }

    /**
     * Helper to find element within this component
     */
    find(selector) {
        return this.element ? this.element.querySelector(selector) : null;
    }
}
