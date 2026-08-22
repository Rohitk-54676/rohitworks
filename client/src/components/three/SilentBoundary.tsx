import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time errors from purely decorative children (e.g. the
 * WebGL background) and silently renders nothing instead of taking down
 * the rest of the page.
 */
class SilentBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Decorative visual failed, hiding it safely:", error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default SilentBoundary;
