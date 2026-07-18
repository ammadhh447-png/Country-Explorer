import type { CountrySummary } from "@/types/country";

export const FAMOUS_PEOPLE: Record<string, string[]> = {
  USA: ["Barack Obama", "Taylor Swift", "Elon Musk"],
  GBR: ["William Shakespeare", "David Beckham", "Adele"],
  FRA: ["Marie Curie", "Zinedine Zidane", "Léa Seydoux"],
  DEU: ["Albert Einstein", "Angela Merkel", "Ludwig van Beethoven"],
  ITA: ["Leonardo da Vinci", "Sophia Loren", "Giorgio Armani"],
  ESP: ["Pablo Picasso", "Rafael Nadal", "Penélope Cruz"],
  JPN: ["Hayao Miyazaki", "Shohei Ohtani", "Yoko Ono"],
  CHN: ["Confucius", "Jack Ma", "Yao Ming"],
  IND: ["Mahatma Gandhi", "Sachin Tendulkar", "A. R. Rahman"],
  BRA: ["Pelé", "Anitta", "Paulo Coelho"],
  CAN: ["Leonard Cohen", "Celine Dion", "Wayne Gretzky"],
  AUS: ["Nicole Kidman", "Hugh Jackman", "Cathy Freeman"],
  MEX: ["Frida Kahlo", "Guillermo del Toro", "Carlos Santana"],
  ARG: ["Lionel Messi", "Diego Maradona", "Jorge Luis Borges"],
  ZAF: ["Nelson Mandela", "Charlize Theron", "Trevor Noah"],
  NGA: ["Chinua Achebe", "Wole Soyinka", "Burna Boy"],
  EGY: ["Cleopatra", "Mohamed Salah", "Omar Sharif"],
  KOR: ["BTS", "Ban Ki-moon", "Park Ji-sung"],
  RUS: ["Leo Tolstoy", "Maria Sharapova", "Yuri Gagarin"],
  TUR: ["Mustafa Kemal Atatürk", "Orhan Pamuk", "Arda Güler"],
  SAU: ["Mohammed bin Salman", "Mohammed Abdu", "Riyadh Season hosts"],
  ARE: ["Sheikh Zayed", "Mohammed bin Rashid", "Hussain Al Jassmi"],
  CHE: ["Roger Federer", "Albert Einstein", "Jean-Jacques Rousseau"],
  SWE: ["ABBA", "Greta Thunberg", "Alfred Nobel"],
  NOR: ["Edvard Munch", "Edvard Grieg", "Erling Haaland"],
  NLD: ["Vincent van Gogh", "Anne Frank", "Johan Cruyff"],
  BEL: ["Audrey Hepburn", "René Magritte", "Romelu Lukaku"],
  POL: ["Marie Curie", "Frédéric Chopin", "Robert Lewandowski"],
  PRT: ["Cristiano Ronaldo", "Fernando Pessoa", "Amália Rodrigues"],
  GRC: ["Socrates", "Maria Callas", "Giannis Antetokounmpo"],
  ISR: ["Golda Meir", "Gal Gadot", "Yitzhak Rabin"],
  IRN: ["Cyrus the Great", "Rumi", "Asghar Farhadi"],
  PAK: ["Malala Yousafzai", "Imran Khan", "Nusrat Fateh Ali Khan"],
  BGD: ["Sheikh Mujibur Rahman", "Rabindranath Tagore", "Shakib Al Hasan"],
  THA: ["Buddha (tradition)", "Tony Jaa", "Thai royal culture"],
  VNM: ["Hồ Chí Minh", "Ngô Quyền", "Pham Nhat Vuong"],
  IDN: ["Sukarno", "Joko Widodo", "Rich Brian"],
  PHL: ["José Rizal", "Manny Pacquiao", "Lea Salonga"],
  NZL: ["Jacinda Ardern", "Peter Jackson", "Edmund Hillary"],
  COL: ["Gabriel García Márquez", "Shakira", "James Rodríguez"],
  CHL: ["Pablo Neruda", "Gabriela Mistral", "Alexis Sánchez"],
  PER: ["Mario Vargas Llosa", "Paolo Guerrero", "Inca heritage"],
  KEN: ["Wangari Maathai", "Eliud Kipchoge", "Lupita Nyong'o"],
  MAR: ["Hassan II", "Hakim Ziyech", "Youssef En-Nesyri"],
  UKR: ["Taras Shevchenko", "Serhiy Bubka", "Klitschko brothers"],
  FIN: ["Jean Sibelius", "Linus Torvalds", "Sanna Marin"],
  DNK: ["Hans Christian Andersen", "Lars von Trier", "Christian Eriksen"],
  IRL: ["Bono", "Oscar Wilde", "Conor McGregor"],
  AUT: ["Wolfgang Amadeus Mozart", "Arnold Schwarzenegger", "Sigmund Freud"],
  CZE: ["Franz Kafka", "Jaromír Jágr", "Antonín Dvořák"],
  HUN: ["Ferenc Puskás", "Béla Bartók", "Erno Rubik"],
  ROU: ["Nadia Comăneci", "Eugen Ionesco", "Gheorghe Hagi"],
  SGP: ["Lee Kuan Yew", "Joseph Schooling", "F1 Grand Prix hosts"],
};

export function getFamousPeople(cca3: string): string[] {
  return FAMOUS_PEOPLE[cca3] ?? [];
}

export function formatFamousPeople(cca3: string): string {
  const people = getFamousPeople(cca3);
  return people.length > 0 ? people.join(", ") : "Notable figures vary by region and era";
}

export function getPopulationRank(
  cca3: string,
  countries: CountrySummary[]
): number | null {
  if (!countries.length) return null;
  const sorted = [...countries].sort((a, b) => b.population - a.population);
  const index = sorted.findIndex((c) => c.cca3 === cca3);
  return index >= 0 ? index + 1 : null;
}

export function formatPopulationRank(
  cca3: string,
  countries: CountrySummary[]
): string {
  const rank = getPopulationRank(cca3, countries);
  if (!rank) return "N/A";
  return `#${rank} of ${countries.length}`;
}
