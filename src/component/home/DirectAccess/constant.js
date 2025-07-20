export const DIRECT_ACCESS_GROUP = {
  Public: 'Public',
  Internal: 'Internal',
};

export const DIRECT_ACCESS = {
  [DIRECT_ACCESS_GROUP.Public]: [
    {
      title: 'New technical documentation',
      description:
        'The FOITT has published new technical documentation on eIAM.',
      titleI18nKey: 'DirectAccess.NewTechnicalDocumentation.title',
      descriptionI18nKey: 'DirectAccess.NewTechnicalDocumentation.description',
    },
    {
      title: 'eIAM-Release Plan',
      description:
        'The release notes describe changes to the eIAM service and new functionalities.',
      titleI18nKey: 'DirectAccess.EIAMPlan.title',
      descriptionI18nKey: 'DirectAccess.EIAMPlan.description',
    },
  ],
  [DIRECT_ACCESS_GROUP.Internal]: [
    {
      title: 'Discussion Forum',
      description: 'eIAM, questions and discussions, moderated by the FChDTI',
      titleI18nKey: 'DirectAccess.DiscussionForum.title',
      descriptionI18nKey: 'DirectAccess.DiscussionForum.description',
    },
    {
      title: 'Sounding Board',
      description:
        'Description of forthcoming releases, P035 status and roadmap',
      titleI18nKey: 'DirectAccess.SoundingBoard.title',
      descriptionI18nKey: 'DirectAccess.SoundingBoard.description',
    },
    {
      title: 'eIAM Dossier',
      description:
        'New: Procuring an application or connecting an application to eIAM? Please open your eIAM dossier online',
      titleI18nKey: 'DirectAccess.EIAMDossier.title',
      descriptionI18nKey: 'DirectAccess.EIAMDossier.description',
    },
    {
      title: 'eIAM Tarrif',
      description: 'Calculate your recurring costs',
      titleI18nKey: 'DirectAccess.EIAMTarrif.title',
      descriptionI18nKey: 'DirectAccess.EIAMTarrif.description',
    },
  ],
};
