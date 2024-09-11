# Project Overview

# Architectural Decisions

- **Clean Architecture** was used because the benefits of separations of concerns. This architecture is useful
to keep the business logic isolated from other concerns such as infrastructure. 
- **Use Cases** were used to encapsulate the business logic. This brings clarity and adds maintainability by having
one single responsibility for each of the use cases. There was a separation of commands and queries. Commands change the state
of the application and queries answer a question about the state of the application. Having this separation allows for 
cleaner code.

# Technology Choices
- **WS** library to handle the socket connections. This library was picked because it is lightweight as compare to other
options such as socket.io. It is not known if the frontend is using a browser socket or socket.io.
- **TypeScript** was picked to provide static code analysis and make it easier to identify bugs. As well as better code
maintainability.

# Design Patterns and Principles
- **Repository Pattern** is used to decouple business logic from the database layer. This makes it easier to change storage
solutions. It was useful to me because it allowed me to switch from Sqlite to an in-memory storage.
- **Domain Driven Design** influenced in my data model design. Having rich entities helped me isolate the business logic
inside the entities without leaking details to the use cases.
- **In-Memory Repository** meets the requirements for the scope of this challenge. Sqlite was an option but such solution involved
setting up a database model which added unnecessary complexity since no long term storage is needed.

# Testing
- **Unit Testing** picked Yest package because it offers a way to mock dependencies making the test focus in isolated and
individual components. Ensuring each component works in isolation.
- **Test Structure** decided to mirror the structure of the codebase. It provides organization.

# Future Considerations
- Improve test for controllers.
- Better Error handling.
