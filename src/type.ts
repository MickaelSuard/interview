export type ConversationItem = {
    readonly id: number;
    readonly question: string;
    readonly audioDuration: string;
    readonly audioWaveform: number[];
    readonly audioSrc?: string;
};

export type Contact = {
    readonly id: string;
    readonly initials: string;
    readonly name: string;
    readonly role: string;
    readonly preview: string;
    readonly date: string;
    readonly status: string;
    readonly avatarClassName: string;
    readonly avatarTextClassName: string;
    readonly conversation: ConversationItem[];
};
