// Terminal elements
      const terminal = document.querySelector('#terminal-modal');
      const openTerminal = document.querySelector('.terminal-btn');
      const closeTerminal = document.querySelector('.terminal-close');
      const terminalForm = document.querySelector('#terminal-form');
      const terminalInput = document.querySelector('#terminal-input');
      const terminalOutput = document.querySelector('#terminal-output');
      const terminalPrompt = document.querySelector('#terminal-form label');

      if (
        terminal instanceof HTMLDialogElement &&
        openTerminal instanceof HTMLButtonElement &&
        closeTerminal instanceof HTMLButtonElement &&
        terminalForm instanceof HTMLFormElement &&
        terminalInput instanceof HTMLInputElement &&
        terminalOutput instanceof HTMLElement &&
        terminalPrompt instanceof HTMLLabelElement
      ) {
        // Intentional CTF cookie, not a real session token.
        document.cookie = 'n3x_session=N3X{accept_cookies_reject_reality}; path=/; SameSite=Lax';

        const HOME = '/home/visitor';
        let currentPath = HOME;

        // Store only SHA-256 hashes in the submission checker.
        const flagHashes: Record<string, string> = {
          source: 'd3a800abf8511d78d67877beb76ba56559e35184ca20ebe457e841e09da37e75',
          cookie: '8712c8e1ae50eeb461572a0c1b658f7ea4a9879cfe4ac6a303b1506e6787c4d9',
          terminal: 'c5bdaf4b3383ee6241e657a8d1ef5656a1535cc0544f5fe07bf7187756e454a7'
        };

        const solved = new Set<string>(
          JSON.parse(localStorage.getItem('n3x_ctf_solved') ?? '[]')
        );

        // The terminal is fictional, but visible listings come from Astro content.
        type TerminalFile = { name: string; content: string };
        type TerminalCatalog = {
          projects: TerminalFile[];
          rabbitHoles: TerminalFile[];
          certificates: TerminalFile[];
          currently: string;
          log: string;
          maybe: string;
        };
        const catalogNode = document.querySelector('#terminal-catalog');
        let catalog: TerminalCatalog = {
          projects: [], rabbitHoles: [], certificates: [],
          currently: '', log: '', maybe: ''
        };
        try {
          if (catalogNode?.textContent) {
            catalog = JSON.parse(catalogNode.textContent) as TerminalCatalog;
          }
        } catch (error) {
          console.warn('Terminal catalog was unavailable', error);
        }

        const listing = (entries: TerminalFile[]): Record<string, string> =>
          Object.fromEntries(entries.map(({ name, content }) => [name, content]));

        // null = virtual directory; text = the preview returned by 'cat'.
        // Keep the hidden CTF path and flag unchanged.
        const fileSystem: Record<string, Record<string, string | null>> = {
          '/': { home: null },
          '/home': { visitor: null },
          '/home/visitor': {
            projects: null,
            'rabbit-holes': null,
            certificates: null,
            secrets: null,
            '.archive': null,
            'currently.txt': catalog.currently,
            'log.txt': catalog.log,
            'maybe.txt': catalog.maybe,
            'readme.txt':
              "Welcome to n3Xm@R's little corner of the internet.\n" +
              'These notes follow the latest published site content.\n' +
              'Take a look around.'
          },
          '/home/visitor/projects': listing(catalog.projects),
          '/home/visitor/rabbit-holes': listing(catalog.rabbitHoles),
          '/home/visitor/certificates': listing(catalog.certificates),
          '/home/visitor/secrets': {
            'note.txt': 'Nothing useful here. Or maybe I forgot where I put it.'
          },
          '/home/visitor/.archive': {
            backup: null,
            'journal.txt': 'An old archive. The interesting stuff was backed up somewhere.'
          },
          '/home/visitor/.archive/backup': {
            'old-notes.txt':
              'Forgotten note:\nN3X{not_everything_is_in_plain_sight}'
          }
        };

        function printLine(message: string, color = '#ABA29A') {
          const line = document.createElement('p');
          line.textContent = message;
          line.style.color = color;
          terminalOutput.appendChild(line);
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        function showWelcome() {
          terminalOutput.replaceChildren();
          printLine('[ N3X MINI CTF ]', '#E9B44C');
          printLine('3 flags are hidden somewhere on this website.\nFind them. No spoilers.');
          printLine(`Captured: ${solved.size}/3`, '#E9B44C');
          printLine('Submit a flag: submit N3X{...}\nType help for terminal commands.');
        }

        function resolvePath(input: string) {
          let path: string;
          if (input === '~') path = HOME;
          else if (input.startsWith('~/')) path = HOME + input.slice(1);
          else if (input.startsWith('/')) path = input;
          else path = currentPath + '/' + input;

          const parts: string[] = [];
          for (const part of path.split('/')) {
            if (!part || part === '.') continue;
            if (part === '..') parts.pop();
            else parts.push(part);
          }
          return '/' + parts.join('/');
        }

        function updatePrompt() {
          let displayPath = currentPath;
          if (currentPath === HOME) displayPath = '~';
          else if (currentPath.startsWith(HOME + '/')) {
            displayPath = '~' + currentPath.slice(HOME.length);
          }
          terminalPrompt.textContent = `visitor@n3xmar:${displayPath}$`;
        }

        async function hashFlag(flag: string) {
          const bytes = new TextEncoder().encode(flag);
          const digest = await crypto.subtle.digest('SHA-256', bytes);
          return Array.from(new Uint8Array(digest))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
        }

        async function runCommand(rawCommand: string) {
          const parts = rawCommand.trim().split(/\s+/);
          const command = parts[0].toLowerCase();
          const args = parts.slice(1);

          switch (command) {
            case 'help':
              printLine(
                'COMMANDS\n' +
                'help      Show commands\n' +
                'ls   List files\n' +
                'cd        Change directory\n' +
                'cat       Read a file\n' +
                'submit    Submit a flag\n' +
                'clear     Clear screen\n' +
                'exit      Close terminal'
              );
              break;

            case 'ls': {
              const showHidden = args.includes('-a');
              const pathArgument = args.find((arg) => arg !== '-a') ?? '.';
              const target = resolvePath(pathArgument);
              const directory = fileSystem[target];

              if (!directory) {
                printLine(`ls: cannot access '${pathArgument}': No such directory`);
                break;
              }

              const items = Object.entries(directory)
                .filter(([name]) => showHidden || !name.startsWith('.'))
                .map(([name, value]) => value === null ? `${name}/` : name);
              if (showHidden) items.unshift('.', '..');
              printLine(items.join('    ') || '(empty)');
              break;
            }

            case 'cd': {
              const target = args.length ? resolvePath(args[0]) : HOME;
              if (!fileSystem[target]) {
                printLine(`cd: no such directory: ${args[0] ?? ''}`);
                break;
              }
              currentPath = target;
              updatePrompt();
              break;
            }

            case 'cat': {
              if (!args[0]) {
                printLine('Usage: cat <filename>');
                break;
              }
              const target = resolvePath(args[0]);
              const lastSlash = target.lastIndexOf('/');
              const parentPath = target.slice(0, lastSlash) || '/';
              const filename = target.slice(lastSlash + 1);
              const directory = fileSystem[parentPath];

              if (!directory || !Object.hasOwn(directory, filename)) {
                printLine(`cat: ${args[0]}: No such file`);
                break;
              }
              const content = directory[filename];
              printLine(content === null ? `cat: ${args[0]}: Is a directory` : content);
              break;
            }

            case 'submit': {
              const flag = args.join(' ');
              if (!flag) {
                printLine('Usage: submit N3X{...}');
                break;
              }

              const digest = await hashFlag(flag);
              const matchingChallenge = Object.entries(flagHashes)
                .find(([, expectedHash]) => expectedHash === digest)?.[0];

              if (!matchingChallenge) {
                printLine('✗ Incorrect flag. Try again.', '#F0ECE4');
                break;
              }
              if (solved.has(matchingChallenge)) {
                printLine('Already captured this flag!', '#E9B44C');
                break;
              }

              solved.add(matchingChallenge);
              localStorage.setItem('n3x_ctf_solved', JSON.stringify([...solved]));
              printLine(`✓ Flag captured! (${solved.size}/3)`, '#E9B44C');
              if (solved.size === 3) {
                printLine('All 3 flags captured. Nice work! 🎉', '#E9B44C');
              }
              break;
            }

            case 'clear':
              terminalOutput.replaceChildren();
              break;

            case 'exit':
              terminal.close();
              break;

            default:
              printLine(`Command not found: ${command}. Type 'help'.`, '#F0ECE4');
          }
        }

        openTerminal.addEventListener('click', () => {
          terminal.showModal();
          terminalInput.focus();
          // Show the introduction again if the user cleared the screen.
          if (!terminalOutput.childElementCount) showWelcome();
        });

        closeTerminal.addEventListener('click', () => terminal.close());

        terminal.addEventListener('click', (event) => {
          const rect = terminal.getBoundingClientRect();
          const clickedOutside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;
          if (clickedOutside) terminal.close();
        });

        terminalForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const rawCommand = terminalInput.value.trim();
          terminalInput.value = '';
          if (!rawCommand) return;

          printLine(`${terminalPrompt.textContent} ${rawCommand}`, '#E9B44C');
          try {
            await runCommand(rawCommand);
          } catch (error) {
            console.error('Terminal error:', error);
            printLine('An unexpected error occurred.', '#F0ECE4');
          }
        });

        updatePrompt();
        showWelcome();
      }
