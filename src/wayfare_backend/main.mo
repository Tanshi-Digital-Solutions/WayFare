import Types "types";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor Main {
  stable var users: [Types.User] = [];
  public func createUser(name: Text, email: Text, password: Text) : async() {
    let newUser: Types.User = {
      name = name;
      email = email;
      password = password;
      var accountBalance = 0;
      paymentMethods = ?["MTN", "Airtel"];
      phone = ?"0";
      tickets = ?["0", "1"];
      var isLoggedIn = false;
    };
    
    users := Array.append(users, [newUser]);
  };

  private func findUserIndexByEmail(email: Text): ?Nat {
    for (i in Iter.range(0, users.size() - 1)) {
      if (users[i].email == email) {
        return ?i;
      }
    };
    return null;

  };

  public func login(email: Text, password: Text): async ?Text {
        let userIndexOpt = findUserIndexByEmail(email);
        switch (userIndexOpt) {
            case (?index) {
                if (users[index].password == password) {
                    // Update the user's isLoggedIn status directly
                    users[index].isLoggedIn := true;
                    return ?("Logged in");
                } else {
                    return ?("Incorrect password");
                }
            };
            case (null) {
                return ?("User not found");
            }
        }
    }


  
};
