## A co my tu mamy?

W pliku **task.ts** mamy funkcje która pobiera drzewo kategorii pewnych produktów z zewnętrznego źródła, odpowiednio je mapuje i zwraca.
Dodatkowo funkcja **categoryTree** zawiera błąd, polegający na niewłaściwym sortowaniu kategorii drugiego poziomu (szczegóły w wymaganiach do zadania).

W pliku **mockedApi.ts** znajduje się fejkowe źródło danych i tam nie ma potrzeby nic zmieniać.

## Co należy zrobić?

1. Refactor funkcji categoryTree. Wszystkie chwyty dozwolone. Dzielenie funkcji, wynoszenie zależności, zmiana parametrów wejściowych, etc...
2. Źródło danych (funkcja getCategories) powinna być przekazywana jako zależność. W idealnym scenariuszu categoryTree opiera się na abstrakcji i nie jest świadoma co konretnie zostanie jej przekazane
3. Poprawiony zostanie bug opisany poniżej.
4. W osobnym pliku przeprowadzony zostanie dowód (w postaci kodu) który jednoznacznie pokaże poprawność działania funkcji categoryTree.

> Wszystkie potrzebne paczki są już w tym repozytorium, aczkolwiek można użyć dowolnych.

## Na czym polega bug?

Dla każdej pobieranej kategorii, w parametrze **Title** moze być zawarta opcjonalna numeracja która powinna definiować kolejność zwracaną przez funkcje (w polu **order**).
Na ten moment sortowanie działa nieprawidłowo, należy to poprawić.

> Dla wejścia znajdującego się w pliku **input.ts**, w tym momencie funkcja zwraca takie wyjście jak w pliku **currentResult.ts**. Oczekiwane wyjście zawarte jest w pliku **correctResult.ts**

## Jak używać tego repo

Najważniejsza komenda dla tego zadania to **npm run test** - buduje ona TSa i odpala testy. Ta komenda się wywali jeśli kod nie przejdzie eslinta i prettiera. Zatem żeby sprawdzić swoje zadanie należy najpierw pozbyć się błędów z eslinta i odpalić **fix:prettier**.

## My assumptions

While working on this assignment, I wasn’t entirely sure what aspects would be evaluated, so I made certain assumptions to simplify the code. Some of those assumptions may have been incorrect, and I’m open to any feedback during review.

1. When installing packages, I noticed a few vulnerabilities, so I only upgraded those marked as critical or high severity. The task was created some time ago, so I could have updated all packages to the latest versions, but I decided against fixing issues that weren’t present when the last commit was made two years ago.

2. I didn’t check the entire repository setup or each package’s configuration - only what I needed. I also only ran scripts that utilized the updated packages, so please let me know if testing every script was also part of the requirement.

3. I kept the approach KISS and YAGNI in mind. I didn’t strictly follow any particular paradigms, naming conventions, or design patterns just to prove familiarity with them.

4. In task.ts, I added a few helper functions; theoretically, they could be moved to a separate folder, but the amount of code felt manageable and readable enough as-is.

5. The primary goal was refactoring, so I only changed the business logic minimally and only where I felt it was necessary. Error handling around the API in categoryTree is admittedly naive, and the error isn’t logged anywhere - it was just enough to prevent the application from crashing.

6. Finally, I noticed some integration tests in the package.json; while categoryTree could be tested in that manner, unit tests were sufficient for my refactoring work.
