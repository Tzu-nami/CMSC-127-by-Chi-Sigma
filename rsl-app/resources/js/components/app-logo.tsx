import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary hover:bg-sidebar-primary-hover transition-colors">
                <AppLogoIcon className="size-5 fill-current text-foreground dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    RS School
                </span>
                <span className="text-xs leading-tight text-background truncate">
                    Library Management System
                </span>
            </div>
        </>
    );
}
