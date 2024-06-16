export type ExtractValueOfStringArray<Type> = {
	[Property in keyof Type as Exclude<Property, Type[Property] extends string[] ? never : Property>]: Type[Property]
}
