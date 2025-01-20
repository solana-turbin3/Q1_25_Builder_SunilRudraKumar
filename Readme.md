# Solana Learning Monorepo 🌟

Welcome to the Solana Learning Monorepo! This repository belongs to **Sunil RudraKumar** and is part of the Builders Cohort on Solana-Turbin3. Here, you can find all my learnings and projects related to Rust, Anchor, and Solana.

## About 📚

This monorepo is organized using `lerna` and `npm` workspaces to manage multiple packages efficiently. It contains various projects and code snippets that I have worked on during my learning journey.

## Projects 🚀

- **Rust Airdrop**: A project to understand and implement airdrop functionality using Rust on Solana.
- **Solana Starter**: A starter project for Solana development, including both Rust and TypeScript code.

## Getting Started 🛠️

To get started with this monorepo, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/solana-learning-monorepo.git
    cd solana-learning-monorepo
    ```

2. **Install dependencies**:
    ```sh
    lerna bootstrap
    ```

3. **Run the projects**:
    Navigate to the respective package directory and follow the instructions in the package's README or `Cargo.toml`/[package.json](http://_vscodecontentref_/1).

## Monorepo Architecture 🏗️

This repository follows a monorepo architecture, allowing for efficient management of multiple projects and shared dependencies. The setup was guided by the following steps:

1. Initialize a new Git repository.
2. Create a [package.json](http://_vscodecontentref_/2) file in the root.
3. Install `lerna` globally.
4. Initialize `lerna` in the project.
5. Configure [lerna.json](http://_vscodecontentref_/3) and [package.json](http://_vscodecontentref_/4) for workspaces.
6. Create a [packages](http://_vscodecontentref_/5) directory and move existing projects.
7. Bootstrap the monorepo to install dependencies and link packages.

## License 📄

This project is licensed under the MIT License.

Happy coding! 🎉