export class UserAccountHelper {
  public generateUsername(names: Name) {
    let generatedname = "";
    const { firstname, surname, othernames } = names;
    if (firstname != "" && surname != "" && othernames != "") {
      generatedname = `${firstname}${othernames.substring(
        0,
        1
      )}${surname.substring(0, 3)}`;
    } else if (firstname != "" && surname != "") {
      generatedname = `${firstname}${surname.substring(0, 3)}`;
    }
    return generatedname;
  }
}

interface Name {
  surname?: string;
  firstname?: string;
  othernames?: string;
}
