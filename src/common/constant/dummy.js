export const DUMMY_MENU = [
  {
    label: 'Home',
    href: 'index.php?c=start&l=en',
    key: 'start',
  },
  {
    label: 'Children and Scooter',
    href: 'index.php?c=trottinett&l=en',
    key: 'trottinett',
    children: [
      {
        label: 'Format examples',
        href: 'index.php?c=formatexamples&l=en',
        key: 'formatexamples',
      },
      {
        label: 'Form',
        href: 'index.php?c=formular&l=en',
        key: 'formular',
        children: [
          {
            label: 'Video',
            href: 'index.php?c=trottinettvideo&l=en',
            key: 'trottinettvideo',
            children: [
              {
                label: 'Level 4',
                href: 'index.php?c=onemorepage&l=en',
                key: 'onemorepage',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Gotthard Traffic',
    href: 'index.php?c=gotthardtunnel&l=en',
    key: 'gotthardtunnel',
  },
];
