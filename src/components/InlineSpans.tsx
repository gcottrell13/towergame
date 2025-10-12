interface Props {
    key?: (item: string | number) => any;
    style?: React.CSSProperties;
}

export function InlineSpans({ key, children, style }: Props & React.PropsWithChildren) {
    return Array.isArray(children)
        ? children.map((child) =>
              typeof child !== 'string' && typeof child !== 'number' ? (
                  child
              ) : (
                  <span key={key?.call(null, child) ?? child} style={style}>
                      {child}
                  </span>
              ),
          )
        : children;
}
