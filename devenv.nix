{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: let
  db_name = "";
  db_setup =
    # js
    ''
      // db = db.getSiblingDB("${db_name}");
      db.users.deleteMany({});
      db.ensembles.deleteMany({});

      // Users
      const users = [
        {
          email: "john@example.com",
          password: "$2b$10$X9f4VcJ2PMxPZUyK9OqB6O6P2Z8bGJ/9L4M8J9K9X9X9X9X9X9",
          firstName: "John",
          lastName: "Doe",
          age: 28,
          bio: "Jazz pianist",
          instruments: ["piano", "keyboard"],
          genres: ["jazz", "classical"],
          createdAt: new Date()
        },
        {
          email: "sarah@example.com",
          password: "$2b$10$X9f4VcJ2PMxPZUyK9OqB6O6P2Z8bGJ/9L4M8J9K9X9X9X9X9X9",
          firstName: "Sarah",
          lastName: "Smith",
          age: 32,
          bio: "Classical violinist",
          instruments: ["violin"],
          genres: ["classical"],
          createdAt: new Date()
        },
        {
          email: "test@test.com",
          password: "test",
          firstName: "John",
          lastName: "Arbuckle",
          age: 28,
          bio: "Garfield",
          instruments: ["guitar"],
          genres: ["jazz"],
          createdAt: new Date()
        }
      ];

      const userIds = users.map(user => {
        return db.users.insertOne(user).insertedId;
      });

      // Ensembles
      const ensembles = [
        {
          name: "Classical Ensemble",
          bio: "very cool ensemble",
          createdBy: userIds[0],
          members: [userIds[0], userIds[1]],
          genres: ["classical"],
          createdAt: new Date()
        },
        {
          name: "Takanaka",
          bio: "super cool guy",
          createdBy: userIds[1],
          members: [userIds[1]],
          genres: ["jazz", "fusion"],
          createdAt: new Date()
        }
      ];

      ensembles.forEach(ensemble => {
        db.ensembles.insertOne(ensemble);
      });

      // Indexes
      db.users.createIndex({ email: 1 }, { unique: true });
      db.users.createIndex({ instruments: 1 });
      db.users.createIndex({ genres: 1 });
      db.ensembles.createIndex({ name: 1 });
      db.ensembles.createIndex({ genres: 1 });
      db.ensembles.createIndex({ members: 1 });

      print("Database seeded!");
    '';
  mongo-seed =
    # sh
    ''
      until mongosh --eval "db.adminCommand('ping')" &>/dev/null; do
        echo "Waiting for MongoDB..."
        sleep 1
      done

      mongosh ${db_name} --eval '${db_setup}'
    '';
in {
  packages = [
    pkgs.git
    pkgs.nodejs_20
    pkgs.prettierd
    pkgs.alejandra
    pkgs.hurl
  ];

  languages.typescript.enable = true;

  services.mongodb = {
    enable = true;
    initDatabaseUsername = "test";
    initDatabasePassword = "test";
  };

  processes.backend.exec =
    # sh
    ''
      pnpm install
      pnpm run build:libs
      pnpm run dev:backend
    '';

  processes.mongo-seed.exec = mongo-seed;
  scripts.mongo-seed.exec = mongo-seed;

  scripts.test-e2e.exec =
    # sh
    ''
      until mongosh --eval "db.adminCommand('ping')" &>/dev/null; do
        echo "Waiting for MongoDB..."
        sleep 1
      done

      filter="''${1:-}"
      for test in tests/''${filter}*.hurl; do
        echo "Running $test"
        mongosh ${db_name} --eval '${db_setup}' && \
        hurl --test "$test" --variable host=http://localhost:3000 --error-format long
      done
      mongosh ${db_name} --eval '${db_setup}'
    '';
}
