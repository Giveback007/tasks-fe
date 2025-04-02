type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type AlertType = 'info' | 'danger' | 'warning' | 'success';

type Alert = {
    type?: AlertType;
    title: str;
    size?: 'reg' | 'wide'
    time?: num;
    text?: str;
}

type AlertProps = Alert & {
    id: str | num,
    remove: () => any,
    toDelete?: bol;
}