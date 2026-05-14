type Character = {
  firstName: string;
  lastName: string;
};

const CHARACTERS: Character[] = [
  // Monty Python
  { firstName: 'Arthur', lastName: 'King' },
  { firstName: 'Brian', lastName: 'Cohen' },
  { firstName: 'Sir Robin', lastName: 'Bravely' },
  { firstName: 'Tim', lastName: 'Enchanter' },
  { firstName: 'Dennis', lastName: 'Peasant' },
  { firstName: 'Roger', lastName: 'Shrubber' },
  { firstName: 'Herbert', lastName: 'Swamp-Castle' },
  { firstName: 'Cardinal', lastName: 'Fang' },
  { firstName: 'Stan', lastName: 'Loretta' },
  { firstName: 'Patsy', lastName: 'Coconut' },

  // The Office (UK)
  { firstName: 'David', lastName: 'Brent' },
  { firstName: 'Tim', lastName: 'Canterbury' },
  { firstName: 'Gareth', lastName: 'Keenan' },
  { firstName: 'Dawn', lastName: 'Tinsley' },
  { firstName: 'Keith', lastName: 'Bishop' },
  { firstName: 'Chris', lastName: 'Finch' },
  { firstName: 'Malcolm', lastName: 'Wilkes' },
  { firstName: 'Neil', lastName: 'Godwin' },

  // Peep Show
  { firstName: 'Mark', lastName: 'Corrigan' },
  { firstName: 'Jeremy', lastName: 'Usborne' },
  { firstName: 'Sophie', lastName: 'Chapman' },
  { firstName: 'Alan', lastName: 'Johnson' },
  { firstName: 'Super Hans', lastName: 'Band' },
  { firstName: 'Dobby', lastName: 'Dobson' },
  { firstName: 'Jeff', lastName: 'Heaney' },
  { firstName: 'Elena', lastName: 'Corrigan' },
  { firstName: 'Angus', lastName: 'Bainbridge' },
  { firstName: 'Gail', lastName: 'Hipkiss' },

  // Fawlty Towers
  { firstName: 'Basil', lastName: 'Fawlty' },
  { firstName: 'Sybil', lastName: 'Fawlty' },
  { firstName: 'Manuel', lastName: 'Barcelona' },
  { firstName: 'Polly', lastName: 'Sherman' },
  { firstName: 'Major', lastName: 'Gowen' },

  // Blackadder
  { firstName: 'Edmund', lastName: 'Blackadder' },
  { firstName: 'Baldrick', lastName: 'Dogsbody' },
  { firstName: 'George', lastName: 'Colthurst' },
  { firstName: 'Nursie', lastName: 'Bernard' },
  { firstName: 'Lord', lastName: 'Flashheart' },
  { firstName: 'Darling', lastName: 'Kevin' },
  { firstName: 'Percy', lastName: 'Percy' },

  // Only Fools and Horses
  { firstName: 'Del', lastName: 'Trotter' },
  { firstName: 'Rodney', lastName: 'Trotter' },
  { firstName: 'Trigger', lastName: 'Ball' },
  { firstName: 'Boycie', lastName: 'Boyce' },
  { firstName: 'Marlene', lastName: 'Boyce' },
  { firstName: 'Albert', lastName: 'Trotter' },
  { firstName: 'Cassandra', lastName: 'Parry' },
  { firstName: 'Denzil', lastName: 'Tulser' },
  { firstName: 'Mickey', lastName: 'Pearce' },

  // The IT Crowd
  { firstName: 'Maurice', lastName: 'Moss' },
  { firstName: 'Roy', lastName: 'Trenneman' },
  { firstName: 'Jen', lastName: 'Barber' },
  { firstName: 'Douglas', lastName: 'Reynholm' },
  { firstName: 'Denholm', lastName: 'Reynholm' },
  { firstName: 'Richmond', lastName: 'Avenal' },

  // Father Ted
  { firstName: 'Ted', lastName: 'Crilly' },
  { firstName: 'Dougal', lastName: 'McGuire' },
  { firstName: 'Jack', lastName: 'Hackett' },
  { firstName: 'Mrs', lastName: 'Doyle' },
  { firstName: 'Noel', lastName: 'Furlong' },
  { firstName: 'Dick', lastName: 'Byrne' },

  // The Inbetweeners
  { firstName: 'Will', lastName: 'McKenzie' },
  { firstName: 'Simon', lastName: 'Cooper' },
  { firstName: 'Jay', lastName: 'Cartwright' },
  { firstName: 'Neil', lastName: 'Sutherland' },
  { firstName: 'Phil', lastName: 'Gilbert' },
  { firstName: 'Chloe', lastName: 'Mayfield' },

  // Alan Partridge
  { firstName: 'Alan', lastName: 'Partridge' },
  { firstName: 'Lynn', lastName: 'Benfield' },
  { firstName: 'Michael', lastName: 'Mintcake' },
  { firstName: 'Dan', lastName: 'Moody' },
  { firstName: 'Sidekick', lastName: 'Simon' },

  // Fleabag
  { firstName: 'Fleabag', lastName: 'Waller' },
  { firstName: 'Claire', lastName: 'Walker' },
  { firstName: 'Martin', lastName: 'Godmother' },
  { firstName: 'Belinda', lastName: 'Friers' },

  // Absolutely Fabulous
  { firstName: 'Edina', lastName: 'Monsoon' },
  { firstName: 'Patsy', lastName: 'Stone' },
  { firstName: 'Saffron', lastName: 'Monsoon' },
  { firstName: 'Bubble', lastName: 'DeVere' },

  // Red Dwarf
  { firstName: 'Dave', lastName: 'Lister' },
  { firstName: 'Arnold', lastName: 'Rimmer' },
  { firstName: 'Cat', lastName: 'Dwarf' },
  { firstName: 'Kryten', lastName: 'Series4000' },
  { firstName: 'Holly', lastName: 'Computer' },

  // Vicar of Dibley
  { firstName: 'Geraldine', lastName: 'Granger' },
  { firstName: 'Hugo', lastName: 'Horton' },
  { firstName: 'David', lastName: 'Horton' },
  { firstName: 'Alice', lastName: 'Tinker' },
  { firstName: 'Owen', lastName: 'Newitt' },
  { firstName: 'Frank', lastName: 'Pickle' },

  // Bottom
  { firstName: 'Richie', lastName: 'Rich' },
  { firstName: 'Eddie', lastName: 'Hitler' },

  // Phoenix Nights
  { firstName: 'Brian', lastName: 'Potter' },
  { firstName: 'Jerry', lastName: 'StClair' },
  { firstName: 'Keith', lastName: 'Lard' },
  { firstName: 'Les', lastName: 'Alanos' },

  // Gavin & Stacey
  { firstName: 'Gavin', lastName: 'Shipman' },
  { firstName: 'Stacey', lastName: 'West' },
  { firstName: 'Smithy', lastName: 'Smith' },
  { firstName: 'Nessa', lastName: 'Jenkins' },
  { firstName: 'Mick', lastName: 'Shipman' },
  { firstName: 'Pam', lastName: 'Shipman' },
  { firstName: 'Dawn', lastName: 'West' },
  { firstName: 'Jason', lastName: 'West' },

  // Extras
  { firstName: 'Andy', lastName: 'Millman' },
  { firstName: 'Maggie', lastName: 'Jacobs' },
  { firstName: 'Darren', lastName: 'Lamb' },
  { firstName: 'Barry', lastName: 'Biscuits' },

  // Toast of London
  { firstName: 'Steven', lastName: 'Toast' },
  { firstName: 'Ed', lastName: 'Howzer-Black' },
  { firstName: 'Clem', lastName: 'Fandango' },
  { firstName: 'Jane', lastName: 'Plough' },
  { firstName: 'Ray', lastName: 'Purchase' },

  // Friday Night Dinner
  { firstName: 'Adam', lastName: 'Goodman' },
  { firstName: 'Jonny', lastName: 'Goodman' },
  { firstName: 'Martin', lastName: 'Goodman' },
  { firstName: 'Jackie', lastName: 'Goodman' },
  { firstName: 'Jim', lastName: 'Bell' },

  // Outnumbered
  { firstName: 'Pete', lastName: 'Brockman' },
  { firstName: 'Sue', lastName: 'Brockman' },
  { firstName: 'Jake', lastName: 'Brockman' },
  { firstName: 'Ben', lastName: 'Brockman' },
  { firstName: 'Karen', lastName: 'Brockman' },

  // Still Game
  { firstName: 'Jack', lastName: 'Jarvis' },
  { firstName: 'Victor', lastName: 'McDade' },
  { firstName: 'Navid', lastName: 'Harrid' },
  { firstName: 'Isa', lastName: 'Drennan' },
  { firstName: 'Winston', lastName: 'Ingram' },
  { firstName: 'Tam', lastName: 'Mullen' },

  // Derry Girls
  { firstName: 'Erin', lastName: 'Quinn' },
  { firstName: 'Orla', lastName: 'McCool' },
  { firstName: 'Clare', lastName: 'Devlin' },
  { firstName: 'Michelle', lastName: 'Mallon' },
  { firstName: 'James', lastName: 'Maguire' },
  { firstName: 'Sister', lastName: 'Michael' },

  // Mrs Brown's Boys
  { firstName: 'Agnes', lastName: 'Brown' },
  { firstName: 'Cathy', lastName: 'Brown' },
  { firstName: 'Rory', lastName: 'Brown' },
  { firstName: 'Winnie', lastName: 'McGoogan' },
  { firstName: 'Buster', lastName: 'Brady' },

  // Ghosts
  { firstName: 'Thomas', lastName: 'Thorne' },
  { firstName: 'Lady', lastName: 'Button' },
  { firstName: 'Pat', lastName: 'Butcher' },
  { firstName: 'Robin', lastName: 'Caveman' },
  { firstName: 'Julian', lastName: 'Fawcett' },
  { firstName: 'Kitty', lastName: 'Higham' },
  { firstName: 'Humphrey', lastName: 'Bone' },
  { firstName: 'Mary', lastName: 'Plague' },

  // Spaced
  { firstName: 'Tim', lastName: 'Bisley' },
  { firstName: 'Daisy', lastName: 'Steiner' },
  { firstName: 'Brian', lastName: 'Topp' },
  { firstName: 'Twist', lastName: 'Morgan' },
  { firstName: 'Mike', lastName: 'Watt' },

  // Detectorists
  { firstName: 'Andy', lastName: 'Stone' },
  { firstName: 'Lance', lastName: 'Stater' },
  { firstName: 'Becky', lastName: 'Stone' },

  // This Country
  { firstName: 'Kerry', lastName: 'Mucklowe' },
  { firstName: 'Kurtan', lastName: 'Mucklowe' },
  { firstName: 'Mandy', lastName: 'Harris' },

  // Mighty Boosh
  { firstName: 'Howard', lastName: 'Moon' },
  { firstName: 'Vince', lastName: 'Noir' },
  { firstName: 'Naboo', lastName: 'Shaman' },
  { firstName: 'Bob', lastName: 'Fossil' },

  // Black Books
  { firstName: 'Bernard', lastName: 'Black' },
  { firstName: 'Manny', lastName: 'Bianco' },
  { firstName: 'Fran', lastName: 'Katzenjammer' },

  // Coupling
  { firstName: 'Jeff', lastName: 'Murdock' },
  { firstName: 'Steve', lastName: 'Taylor' },
  { firstName: 'Patrick', lastName: 'Maitland' },
  { firstName: 'Susan', lastName: 'Walker' },
  { firstName: 'Sally', lastName: 'Harper' },
  { firstName: 'Jane', lastName: 'Christie' },

  // Ted Lasso
  { firstName: 'Ted', lastName: 'Lasso' },
  { firstName: 'Roy', lastName: 'Kent' },
  { firstName: 'Jamie', lastName: 'Tartt' },
  { firstName: 'Keeley', lastName: 'Jones' },
  { firstName: 'Rebecca', lastName: 'Welton' },
  { firstName: 'Nate', lastName: 'Shelley' },
  { firstName: 'Dani', lastName: 'Rojas' },

  // Taskmaster regulars
  { firstName: 'Greg', lastName: 'Davies' },
  { firstName: 'Alex', lastName: 'Horne' },
];

const ADDRESSES = [
  { line1: '27 Fredrick Ave', city: 'London', postal_code: 'SW1A 1AA' },
  { line1: '4 Privet Drive', city: 'London', postal_code: 'E1 6AN' },
  { line1: '12 Grimmauld Place', city: 'London', postal_code: 'N1 9GU' },
  { line1: '62 West Wallaby Street', city: 'Wigan', postal_code: 'WN1 1YB' },
  { line1: '23 Railway Cuttings', city: 'East Cheam', postal_code: 'SM3 8QT' },
  { line1: '42 Acacia Avenue', city: 'Surbiton', postal_code: 'KT6 4SH' },
  { line1: '7 Nelson Mandela House', city: 'Peckham', postal_code: 'SE15 5QN' },
  { line1: '1 Coronation Street', city: 'Weatherfield', postal_code: 'M5 4DX' },
  { line1: '29 Acacia Road', city: 'Nuttytown', postal_code: 'NW1 4NR' },
  { line1: '52 Festive Road', city: 'Putney', postal_code: 'SW15 1TW' },
  { line1: '8 Letsby Avenue', city: 'Gasforth', postal_code: 'NE6 5BT' },
  { line1: '3 Bucket Residence', city: 'Coventry', postal_code: 'CV1 2WT' },
  { line1: '15 Yemen Road', city: 'Yemen', postal_code: 'W1A 1AB' },
  { line1: '69 Whitbury New Town', city: 'Royston Vasey', postal_code: 'HD7 5QJ' },
  { line1: '31 Dibley Lane', city: 'Dibley', postal_code: 'OX7 3PG' },
];

export function getRandomCharacter() {
  const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  const addr = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)];
  const suffix = Math.floor(Math.random() * 9000) + 1000;

  const email = `${char.firstName.toLowerCase().replace(/\s+/g, '')}.${char.lastName.toLowerCase().replace(/\s+/g, '')}+${suffix}@example.com`;

  return {
    firstName: char.firstName,
    lastName: char.lastName,
    email,
    phone: `+4479${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
    dob: `${1970 + Math.floor(Math.random() * 25)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    address: {
      line1: addr.line1,
      line2: null,
      city: addr.city,
      state: '',
      postal_code: addr.postal_code,
      country: 'GB',
    },
  };
}
